import React, { useState } from 'react';
import { generateSouvenirImage, editVacationPhoto, fileToGenerativePart } from '../services/geminiService';
import { ImageSize, AspectRatio } from '../types';
import { Loader2, Wand2, ImagePlus, Download, RefreshCw, Upload, Sparkles, Settings2 } from 'lucide-react';

type Mode = 'generate' | 'edit';

export const ImageStudio: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Generation State
  const [genPrompt, setGenPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.Size1K);
  const [ratio, setRatio] = useState<AspectRatio>(AspectRatio.Landscape43);

  // Edit State
  const [editPrompt, setEditPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    setLoading(true);
    setResultImage(null);
    try {
      const response = await generateSouvenirImage(genPrompt, size, ratio);
      
      // Look for image in response
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
             setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
             break;
          }
        }
      }
    } catch (error) {
      console.error('Generation failed', error);
      alert('Failed to generate image. Please check API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedFile || !editPrompt) return;
    setLoading(true);
    setResultImage(null);
    try {
      const base64 = await fileToGenerativePart(selectedFile);
      const mimeType = selectedFile.type;
      
      const response = await editVacationPhoto(editPrompt, base64, mimeType);
      
      // Look for image in response
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
             setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
             break;
          }
        }
      }
    } catch (error) {
      console.error('Edit failed', error);
      alert('Failed to edit image. Try a simpler prompt or different image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setMode('generate')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            mode === 'generate' ? 'bg-puglia-sea text-white' : 'bg-stone-50 text-gray-500 hover:bg-stone-100'
          }`}
        >
          <Sparkles size={18} />
          Create Souvenir
        </button>
        <button
          onClick={() => setMode('edit')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            mode === 'edit' ? 'bg-puglia-sea text-white' : 'bg-stone-50 text-gray-500 hover:bg-stone-100'
          }`}
        >
          <Wand2 size={18} />
          Magic Editor
        </button>
      </div>

      <div className="p-6">
        {mode === 'generate' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Describe your dream memory of Puglia</label>
              <textarea
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder="A watercolor painting of the port of Monopoli at sunset..."
                className="w-full h-32 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-puglia-sea/50 focus:border-puglia-sea resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Settings2 size={14}/> Image Size
                  </label>
                  <div className="flex gap-2">
                    {Object.values(ImageSize).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md border ${
                          size === s ? 'bg-puglia-sea text-white border-puglia-sea' : 'bg-white text-gray-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Settings2 size={14}/> Aspect Ratio
                  </label>
                   <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value as AspectRatio)}
                    className="w-full p-2 text-sm border border-stone-300 rounded-md bg-white focus:ring-2 focus:ring-puglia-sea/50"
                  >
                    {Object.values(AspectRatio).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
               </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !genPrompt}
              className="w-full py-3 bg-puglia-terracotta hover:bg-puglia-terracotta/90 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate Art
            </button>
          </div>
        ) : (
          <div className="space-y-6">
             {/* Edit Mode */}
             <div className="space-y-4">
               <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors relative">
                 <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
                 {previewUrl ? (
                    <div className="relative h-48 w-full flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-md shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-md">
                            <RefreshCw className="mr-2"/> Change Photo
                        </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <Upload size={32} className="mb-2 text-puglia-sea"/>
                        <p className="font-medium">Click to upload a photo</p>
                        <p className="text-xs">JPG, PNG supported</p>
                    </div>
                 )}
               </div>

               <div className="space-y-2">
                 <label className="block text-sm font-medium text-gray-700">How should we edit this?</label>
                 <input 
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Add a retro filter, remove the person in background..."
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-puglia-sea/50"
                 />
               </div>

               <button
                  onClick={handleEdit}
                  disabled={loading || !selectedFile || !editPrompt}
                  className="w-full py-3 bg-puglia-olive hover:bg-puglia-olive/90 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  Apply Magic
                </button>
             </div>
          </div>
        )}

        {/* Result Area */}
        {resultImage && (
          <div className="mt-8 pt-6 border-t border-stone-200 animate-in fade-in duration-500">
            <h4 className="text-lg font-serif italic mb-4 text-center">Your Masterpiece</h4>
            <div className="relative group rounded-xl overflow-hidden shadow-xl border border-stone-200 bg-stone-50">
              <img src={resultImage} alt="Generated result" className="w-full h-auto" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a 
                    href={resultImage} 
                    download={`casa-di-lo-${mode}-${Date.now()}.png`}
                    className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
                >
                    <Download size={24} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
