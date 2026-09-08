import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiImage, FiUpload, FiX } from 'react-icons/fi';
import { productService } from '../../services/productService';
import { mediaUrl } from '../../utils/media';

export default function ImageField({ label, value, onChange, tall = false }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(file.name)) {
      toast.error(t('admin.upload.hint'));
      return;
    }
    setUploading(true);
    try {
      const url = await productService.upload(file);
      onChange(url);
      toast.success(t('admin.upload.success'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => uploadFile(event.target.files?.[0])}
        disabled={uploading}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          uploadFile(event.dataTransfer.files?.[0]);
        }}
        className={`relative overflow-hidden rounded-[22px] border-2 border-dashed cursor-pointer transition-all ${
          tall ? 'min-h-[240px] sm:min-h-[280px]' : 'min-h-[180px]'
        } ${
          dragOver
            ? 'border-[#C63637] bg-[#C63637]/5'
            : 'border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 hover:border-[#C63637]/60'
        }`}
      >
        {value ? (
          <>
            <img src={mediaUrl(value)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange('');
              }}
              className="absolute top-3 end-3 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center"
              aria-label={t('admin.upload.remove')}
            >
              <FiX />
            </button>
            <div className={`relative z-10 flex flex-col items-center justify-center text-white p-6 text-center ${tall ? 'min-h-[240px] sm:min-h-[280px]' : 'min-h-[180px]'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur font-bold text-sm">
                <FiUpload />
                {uploading ? t('admin.upload.uploading') : t('admin.upload.replace')}
              </span>
            </div>
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center p-6 text-center ${tall ? 'min-h-[240px] sm:min-h-[280px]' : 'min-h-[180px]'}`}>
            <div className="w-14 h-14 rounded-2xl bg-[#C63637]/10 text-[#C63637] flex items-center justify-center mb-3">
              <FiImage size={26} />
            </div>
            <p className="font-bold text-gray-800 dark:text-white">{uploading ? t('admin.upload.uploading') : t('admin.upload.drop')}</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">{t('admin.upload.hint')}</p>
            <span className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] dark:bg-white text-white dark:text-black text-sm font-bold">
              <FiUpload />
              {t('admin.upload.choose')}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowUrl((open) => !open)}
        className="text-xs font-semibold text-gray-400 hover:text-[#C63637]"
      >
        {t('admin.upload.urlToggle')}
      </button>
      {showUrl && (
        <input
          type="url"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t('admin.upload.urlPlaceholder')}
          className="admin-input"
        />
      )}
    </div>
  );
}
