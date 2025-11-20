'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Detection, ChatMessage } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortAscending, setSortAscending] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  //demo User Data make 
  /*const demoUser = {    id: 'demo123',
    name: 'Md Thorat Islam',
    email: 'thoratislam@example.com',
  
    };*/

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    //const userData = JSON.stringify(demoUser);
    
    if (!token || !userData) {
      router.push('/auth');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetections([]);
        setAnnotatedImage(null);
        setMessages([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetections([]);
        setAnnotatedImage(null);
        setMessages([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Use Python Flask backend
      const API_BASE_URL = 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();
      
      if (data.detections) {
        // Map backend format (label, score) to frontend format (class, confidence)
        const mappedDetections = data.detections.map((d: any) => ({
          class: d.label || d.class,
          confidence: d.score || d.confidence,
          bbox: d.bbox
        }));
        setDetections(mappedDetections);
        setAnnotatedImage(data.annotatedImage || selectedImage);
      } else {
        alert('Detection failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error during detection');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || detections.length === 0) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setQuestion('');

    const token = localStorage.getItem('token');
    
    try {
      // Use Python Flask backend
      const API_BASE_URL = 'http://localhost:5000';
      console.log('Sending Q&A request:', { question, detections });
      
      const response = await fetch(`${API_BASE_URL}/api/qa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question, detections }),
      });

      console.log('Q&A response status:', response.status);
      const data = await response.json();
      console.log('Q&A response data:', data);
      
      if (data.answer) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else if (data.error) {
        console.error('Q&A error:', data.error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: `Error: ${data.error}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Q&A error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Failed to get response. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const sortTable = (columnIndex: number) => {
    const isAscending = sortColumn === columnIndex ? !sortAscending : true;
    setSortColumn(columnIndex);
    setSortAscending(isAscending);

    const sorted = [...detections].sort((a, b) => {
      if (columnIndex === 0) {
        return isAscending
          ? a.class.localeCompare(b.class)
          : b.class.localeCompare(a.class);
      } else if (columnIndex === 1) {
        return isAscending
          ? a.confidence - b.confidence
          : b.confidence - a.confidence;
      }
      return 0;
    });

    setDetections(sorted);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-[18px] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-[9px] flex items-center justify-center">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Vision Platform</h1>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 px-2 py-2 pl-2 pr-4 bg-slate-50 rounded-3xl cursor-pointer hover:bg-slate-100 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-[18px] py-2.5 border-[1.5px] border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 py-8 pb-[60px]">
        {/* Upload Section */}
        <section className="bg-white rounded-2xl p-9 mb-7 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            Upload Image for Detection
          </h2>
          <p className="text-sm text-slate-500 mb-7">
            Upload an image to detect objects using our advanced YOLO model
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:border-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-[18px] shadow-lg shadow-blue-600/15">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div className="text-base font-semibold text-slate-900 mb-1.5">
              Drop your image here
            </div>
            <div className="text-sm text-slate-500 mb-5">
              or click to browse (PNG, JPG, JPEG up to 10MB)
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/40 transition-all">
              Select Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedImage && (
            <div className="mt-7 flex gap-6 items-start">
              <div className="flex-1 max-w-[500px] rounded-xl overflow-hidden bg-slate-100">
                <img src={selectedImage} alt="Preview" className="w-full h-auto" />
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDetect}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-green-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-600/40 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Detecting...' : 'Detect Objects'}
                </button>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setDetections([]);
                    setAnnotatedImage(null);
                    setMessages([]);
                  }}
                  className="px-6 py-3 bg-white text-red-500 border-[1.5px] border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {detections.length > 0 && (
          <div>
            <div className="grid grid-cols-2 gap-6 mb-7">
              {/* Annotated Image */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
                    Annotated Image
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                    {detections.length} Objects
                  </span>
                </div>
                <div className="rounded-[10px] overflow-hidden bg-slate-100">
                  <img src={annotatedImage || selectedImage} alt="Annotated" className="w-full h-auto" />
                </div>
              </div>

              {/* Detection Results Table */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
                    Detection Results
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                    Sortable
                  </span>
                </div>
                <div className="rounded-[10px] overflow-hidden border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th
                          onClick={() => sortTable(0)}
                          className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-100 select-none"
                        >
                          Object
                          <span className={`ml-1.5 text-[11px] ${sortColumn === 0 ? 'opacity-100' : 'opacity-40'}`}>
                            {sortColumn === 0 && sortAscending ? '▲' : '▼'}
                          </span>
                        </th>
                        <th
                          onClick={() => sortTable(1)}
                          className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide cursor-pointer hover:bg-slate-100 select-none"
                        >
                          Confidence
                          <span className={`ml-1.5 text-[11px] ${sortColumn === 1 ? 'opacity-100' : 'opacity-40'}`}>
                            {sortColumn === 1 && sortAscending ? '▲' : '▼'}
                          </span>
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Bounding Box
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((detection, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 border-t border-slate-200">
                            <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[13px]">
                              {detection.class}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 border-t border-slate-200">
                            <div className="flex items-center gap-2.5">
                              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transition-all"
                                  style={{ width: `${detection.confidence > 1 ? detection.confidence : detection.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold text-slate-900 text-[13px] min-w-[45px]">
                                {detection.confidence > 1 ? detection.confidence.toFixed(0) : (detection.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 border-t border-slate-200">
                            <span className="font-mono text-xs text-slate-500">
                              ({Array.isArray(detection.bbox) 
                                ? detection.bbox.join(', ') 
                                : `${detection.bbox.x}, ${detection.bbox.y}, ${detection.bbox.width}, ${detection.bbox.height}`})
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-[10px] flex items-center justify-center">
                  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
                    Ask Questions About Results
                  </h3>
                  <p className="text-sm text-slate-500 m-0">
                    Powered by Gemini 2.0 Flash
                  </p>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="max-h-80 overflow-y-auto mb-5 p-4 bg-slate-50 rounded-[10px] border border-slate-200"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                    </svg>
                    <p className="text-sm">Ask a question about the detected objects</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-pink-500 to-pink-700'
                            : 'bg-gradient-to-br from-purple-600 to-purple-800'
                        }`}
                      >
                        {msg.role === 'user' ? user.name.charAt(0).toUpperCase() : 'AI'}
                      </div>
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask a question about the detected objects..."
                  className="flex-1 py-3 px-[18px] border-[1.5px] border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
                />
                <button
                  onClick={handleAskQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-[10px] text-sm font-semibold shadow-md shadow-purple-600/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all whitespace-nowrap"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
