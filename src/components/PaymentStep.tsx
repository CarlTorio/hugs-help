import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, ArrowLeft, Loader2, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPeso } from "@/lib/reservations";
import { getSettings } from "@/lib/settings";
import gcashLogo from "@/assets/gcash-logo.png";

interface PaymentStepProps {
  bookingData: {
    full_name: string;
    table_type_label: string;
    price: number;
    isWeekday: boolean;
  };
  onSubmit: (receiptUrl: string) => void;
  onBack: () => void;
  submitting: boolean;
}

const PaymentStep = ({ bookingData, onSubmit, onBack, submitting }: PaymentStepProps) => {
  const { toast } = useToast();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [gcashName, setGcashName] = useState("Auxiliary Bar");
  const [gcashNumber, setGcashNumber] = useState("0917 123 4567");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSettings(["gcash_name", "gcash_number"]).then((s) => {
      if (s.gcash_name) setGcashName(s.gcash_name);
      if (s.gcash_number) setGcashNumber(s.gcash_number);
    });
  }, []);

  const finalPrice = bookingData.isWeekday
    ? Math.round(bookingData.price * 0.5)
    : bookingData.price;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB.", variant: "destructive" });
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!receiptFile) {
      toast({ title: "Receipt required", description: "Please upload your GCash receipt before proceeding.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = receiptFile.name.split(".").pop() || "jpg";
      const fileName = `receipt_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, receiptFile, { contentType: receiptFile.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
      onSubmit(urlData.publicUrl);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || "Could not upload receipt.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const labelClass = "block font-body font-semibold text-[10px] md:text-[9px] tracking-[2px] uppercase mb-2 text-[#CC0000]";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="space-y-6"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 font-body text-[11px] tracking-[1px] uppercase text-white/50 hover:text-white/80 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Form
      </button>

      {/* Payment Summary */}
      <div className="p-5 rounded-sm border border-white/5" style={{ background: "#0A0000" }}>
        <p className="font-body font-bold text-[9px] tracking-[2px] uppercase text-[#CC0000] mb-3">Payment Summary</p>
        <div className="space-y-2">
          <div className="flex justify-between font-body text-[12px]">
            <span className="text-white/50">Guest</span>
            <span className="text-white/80">{bookingData.full_name}</span>
          </div>
          <div className="flex justify-between font-body text-[12px]">
            <span className="text-white/50">Table</span>
            <span className="text-white/80">{bookingData.table_type_label}</span>
          </div>
          <div className="flex justify-between font-body text-[12px]">
            <span className="text-white/50">Rate</span>
            <span className="text-white/80">{formatPeso(bookingData.price)}</span>
          </div>
          {bookingData.isWeekday && (
            <div className="flex justify-between font-body text-[12px]">
              <span className="text-green-500/70">Weekday 50% OFF</span>
              <span className="text-green-500/70">-{formatPeso(bookingData.price - finalPrice)}</span>
            </div>
          )}
          <div className="border-t border-white/5 pt-2 mt-2 flex justify-between font-body font-bold text-[14px]">
            <span className="text-white/70">Total</span>
            <span className="text-white">{formatPeso(finalPrice)}</span>
          </div>
        </div>
      </div>

      {/* GCash Payment Info */}
      <div className="p-5 rounded-sm border border-[#0070E0]/20" style={{ background: "rgba(0,112,224,0.04)" }}>
        <div className="flex items-center gap-3 mb-4">
          <img src={gcashLogo} alt="GCash" className="h-8 object-contain" />
          <p className="font-body font-bold text-[9px] tracking-[2px] uppercase text-[#007BFF]">Pay via GCash</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-body text-[12px]">
            <span className="text-white/50">Account Name</span>
            <span className="text-white/80 font-semibold">{gcashName}</span>
          </div>
          <div className="flex justify-between font-body text-[12px]">
            <span className="text-white/50">GCash Number</span>
            <span className="text-white/80 font-semibold">{gcashNumber}</span>
          </div>
          <div className="flex justify-between font-body text-[12px]">
            <span className="text-white/50">Amount</span>
            <span className="text-white font-bold">{formatPeso(finalPrice)}</span>
          </div>
        </div>
        <p className="font-body text-[10px] text-white/40 mt-3">
          Send the exact amount to the GCash number above, then upload your receipt below.
        </p>
      </div>

      {/* Receipt Upload */}
      <div>
        <label className={labelClass}>Upload GCash Receipt</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {receiptPreview ? (
          <div className="relative">
            <img
              src={receiptPreview}
              alt="Receipt preview"
              className="w-full max-h-[300px] object-contain rounded-sm border border-white/10"
            />
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="font-body text-[11px] text-green-500/80">{receiptFile?.name}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ml-auto font-body text-[10px] tracking-[1px] uppercase text-white/50 hover:text-white/80 underline"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-white/10 hover:border-[#CC0000]/30 rounded-sm py-10 flex flex-col items-center gap-3 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <ImageIcon size={20} className="text-white/30" />
            </div>
            <div className="text-center">
              <p className="font-body text-[12px] text-white/50">Click to upload receipt</p>
              <p className="font-body text-[10px] text-white/30 mt-1">JPG, PNG — Max 10MB</p>
            </div>
          </button>
        )}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!receiptFile || uploading || submitting}
        className="w-full font-body font-bold text-[11px] md:text-[12px] tracking-[3px] uppercase rounded-full py-4 transition-all duration-300 disabled:opacity-40 text-white"
        style={{ background: receiptFile ? "#8B0000" : "#333" }}
        onMouseEnter={(e) => { if (receiptFile) { e.currentTarget.style.background = "#A80000"; e.currentTarget.style.boxShadow = "0 0 30px rgba(139,0,0,0.4)"; } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = receiptFile ? "#8B0000" : "#333"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {uploading || submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" /> PROCESSING...
          </span>
        ) : (
          "CONFIRM & SUBMIT RESERVATION"
        )}
      </button>

      {!receiptFile && (
        <p className="text-center font-body text-[10px] text-[#CC0000]/60">
          ⚠ You must upload your GCash receipt to proceed
        </p>
      )}
    </motion.div>
  );
};

export default PaymentStep;
