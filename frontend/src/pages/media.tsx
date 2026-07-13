import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useMediaAssets, useUploadMediaAsset, useDeleteMediaAsset } from '../hooks/use-media';
import { MediaAsset } from '../types';

export function MediaPage() {
  const { data: assets, isLoading, isError } = useMediaAssets();
  const uploadMedia = useUploadMediaAsset();
  const deleteMedia = useDeleteMediaAsset();

  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          uploadMedia.mutate({
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            base64Data: base64String,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.fileUrl);
    setCopyingId(asset.id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      deleteMedia.mutate(id, {
        onSuccess: () => {
          if (selectedAsset?.id === id) {
            setSelectedAsset(null);
          }
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-semibold text-lg">Error loading media assets</h2>
        <p className="text-sm mt-1">Make sure the backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Media Library</h1>
        <p className="mt-1 text-sm text-gray-500">Upload, manage, and use files/images for campaigns and article covers.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upload Box */}
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50 hover:bg-gray-50 transition-colors shadow-sm">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <p className="text-sm font-semibold text-gray-900">Upload new media</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Drag and drop files, or choose from files</p>
              <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-sm transition-colors">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadMedia.isPending}
                />
              </label>
              {uploadMedia.isPending && (
                <p className="text-xs text-blue-600 animate-pulse mt-2">Uploading asset...</p>
              )}
            </CardContent>
          </Card>

          {/* Grid View */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {assets?.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-400 text-sm">
                No assets uploaded yet.
              </div>
            ) : (
              assets?.map((asset) => {
                const isImage = asset.fileType.startsWith('image/');
                const isSelected = selectedAsset?.id === asset.id;

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-xl border overflow-hidden bg-white shadow-sm cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video w-full bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                      {isImage ? (
                        <img
                          src={asset.fileUrl}
                          alt={asset.fileName}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      )}
                    </div>
                    {/* Caption */}
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-800 truncate" title={asset.fileName}>
                        {asset.fileName}
                      </p>
                      <p className="text-xxs text-gray-400 font-mono mt-0.5">
                        {(asset.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Details Side Panel */}
        <div className="lg:col-span-1">
          {selectedAsset ? (
            <Card className="sticky top-6 shadow-sm border border-gray-200">
              <CardContent className="p-4 space-y-4">
                <div className="aspect-video w-full bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                  {selectedAsset.fileType.startsWith('image/') ? (
                    <img src={selectedAsset.fileUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-900 truncate" title={selectedAsset.fileName}>
                    {selectedAsset.fileName}
                  </h3>
                  <div className="text-xxs space-y-1.5 border-t border-gray-100 pt-3 text-gray-500 font-mono">
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span className="text-gray-800 text-right truncate max-w-44">{selectedAsset.fileType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size</span>
                      <span className="text-gray-800">{(selectedAsset.fileSize / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded by</span>
                      <span className="text-gray-800">{selectedAsset.uploader?.fullName || selectedAsset.uploader?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span className="text-gray-800">{new Date(selectedAsset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 pt-2 border-t border-gray-100">
                  <Button
                    onClick={() => handleCopyUrl(selectedAsset)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xxs font-semibold py-2 rounded-lg"
                  >
                    {copyingId === selectedAsset.id ? 'Copied!' : 'Copy URL'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedAsset.id)}
                    variant="ghost"
                    className="border border-red-200 text-red-600 hover:bg-red-50 text-xxs font-semibold py-2 rounded-lg"
                    loading={deleteMedia.isPending}
                  >
                    Delete File
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-center text-gray-400 text-xs py-16 bg-gray-50/20">
              Select an asset to view properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
