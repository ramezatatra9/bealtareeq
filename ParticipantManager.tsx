import { useState, useRef } from 'react';
import { useLotteryStore, type Participant } from '../../store/useLotteryStore';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

export const ParticipantManager = ({ lotteryId }: { lotteryId: string }) => {
  const addParticipants = useLotteryStore(state => state.addParticipants);
  const [activeTab, setActiveTab] = useState<'excel' | 'text'>('excel');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        const newParticipants: Omit<Participant, 'id' | 'status'>[] = [];
        
        // Skip header if first row seems like headers
        const startIndex = isNaN(Number(data[0][1])) ? 1 : 0;

        for (let i = startIndex; i < data.length; i++) {
          const row = data[i];
          if (row.length > 0 && row[0]) {
            newParticipants.push({
              name: String(row[0]).trim(),
              phone: row[1] ? String(row[1]).trim() : '',
            });
          }
        }

        if (newParticipants.length > 0) {
          addParticipants(lotteryId, newParticipants);
          toast.success(`تمت إضافة ${newParticipants.length} مشارك بنجاح`);
        } else {
          toast.error('لم يتم العثور على بيانات صالحة في الملف');
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء قراءة الملف');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      toast.error('الرجاء إدخال بيانات المشاركين');
      return;
    }

    const lines = textInput.split('\n');
    const newParticipants: Omit<Participant, 'id' | 'status'>[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Parse "Name,Phone" or just "Name"
      const parts = trimmed.split(',');
      if (parts.length >= 2) {
        newParticipants.push({
          name: parts[0].trim(),
          phone: parts[1].trim()
        });
      } else {
        newParticipants.push({
          name: trimmed,
          phone: ''
        });
      }
    });

    if (newParticipants.length > 0) {
      addParticipants(lotteryId, newParticipants);
      toast.success(`تمت إضافة ${newParticipants.length} مشارك بنجاح`);
      setTextInput('');
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex border-b border-dark-800/50">
        <button
          onClick={() => setActiveTab('excel')}
          className={`flex-1 py-4 text-center font-medium transition-colors flex justify-center items-center gap-2 ${activeTab === 'excel' ? 'text-gold-500 border-b-2 border-gold-500 bg-dark-800/30' : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800/10'}`}
        >
          <Upload size={18} />
          رفع ملف Excel
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-4 text-center font-medium transition-colors flex justify-center items-center gap-2 ${activeTab === 'text' ? 'text-gold-500 border-b-2 border-gold-500 bg-dark-800/30' : 'text-gray-400 hover:text-gray-300 hover:bg-dark-800/10'}`}
        >
          <FileText size={18} />
          إدخال نصي
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'excel' ? (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-dark-800 rounded-xl bg-dark-900/50 hover:border-gold-500/50 transition-colors">
            <Upload className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-300 mb-2">قم برفع ملف .xlsx أو .xls</p>
            <p className="text-sm text-gray-500 mb-6">يجب أن يحتوي الملف على عمودين: الاسم، رقم الهاتف</p>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              ref={fileInputRef}
              onChange={handleExcelUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-dark-800 hover:bg-dark-800/80 text-white font-medium py-2 px-6 rounded-lg border border-dark-800/50 transition-colors"
            >
              اختيار ملف
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-400">
              <p>أدخل كل مشارك في سطر منفصل.</p>
              <p>يمكنك إدخال الاسم فقط، أو الاسم ورقم الهاتف مفصولين بفاصلة (، أو ,)</p>
              <p className="mt-2 font-mono text-gray-500 bg-dark-950 p-2 rounded">
                أحمد محمد<br />
                خالد علي,059xxxxxxx
              </p>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-40 bg-dark-900 border border-dark-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
              placeholder="ألصق الأسماء هنا..."
              dir="auto"
            />
            <button
              onClick={handleTextSubmit}
              className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors self-end"
            >
              <CheckCircle2 size={20} />
              إضافة المشاركين
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManager;
