import { StorageFileField, useStorageFile } from "@yusr_systems/ui";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceFilesTab()
{
  const { formData, handleChange } = useInvoiceContext();
  const { fileInputRef, handleFileChange, handleRemoveFile, handleDownload, showFilePreview, getFileSrc } =
    useStorageFile(handleChange, "invoiceFiles");

  return (
    <div className="w-full flex items-center justify-center shrink-0 bg-muted/10 p-4 rounded-lg border">
      <StorageFileField
        label=""
        file={ formData.invoiceFiles ?? [] }
        onFileChange={ handleFileChange }
        onRemove={ handleRemoveFile }
        onDownload={ handleDownload }
        getFileSrc={ getFileSrc }
        showPreview={ showFilePreview }
        fileInputRef={ fileInputRef }
      />
    </div>
  );
}
