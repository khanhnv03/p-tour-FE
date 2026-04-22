import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME } from '../constants';

export default function AddTour() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [itinerary, setItinerary] = useState([
    { id: 1, title: '', content: '', startTime: '08:00', images: [''] },
    { id: 2, title: '', content: '', startTime: '12:00', images: [] }
  ]);

  const [heroImage, setHeroImage] = useState('');
  const [bentoImages, setBentoImages] = useState(['', '', '', '']);

  const updateBentoImage = (index: number, url: string) => {
    const newImages = [...bentoImages];
    newImages[index] = url;
    setBentoImages(newImages);
  };

  const addImageToDay = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary[index].images = [...(newItinerary[index].images || []), ''];
    setItinerary(newItinerary);
  };

  const removeImageFromDay = (dayIndex: number, imgIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].images = newItinerary[dayIndex].images.filter((_, i) => i !== imgIndex);
    setItinerary(newItinerary);
  };

  const updateImageUrl = (dayIndex: number, imgIndex: number, url: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].images[imgIndex] = url;
    setItinerary(newItinerary);
  };

  const [inclusions, setInclusions] = useState([
    { id: 1, text: '', type: 'included' as 'included' | 'excluded' }
  ]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const addInclusion = (type: 'included' | 'excluded') => {
    setInclusions([...inclusions, { id: Date.now(), text: '', type }]);
  };

  const removeInclusion = (id: number) => {
    setInclusions(inclusions.filter(inc => inc.id !== id));
  };

  const addDay = () => {
    const newId = Date.now();
    setItinerary([...itinerary, { id: newId, title: '', content: '', startTime: '08:00', images: [] }]);
  };

  const removeDay = (id: number) => {
    setItinerary(itinerary.filter(day => day.id !== id));
  };

  return (
    <div className="flex-1 min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-surface-container-low/50">
        <div className="flex items-center gap-6">
          <Link to="/admin/tours" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary/10 transition-colors group">
            <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight text-on-surface">{isEdit ? 'Chỉnh sửa Chuyến thám hiểm' : 'Cấu hình Chuyến thám hiểm'}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isEdit ? 'Cập nhật hành trình' : 'Sáng tạo hành trình tiếp theo'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-primary bg-primary/5 hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{isPreviewOpen ? 'visibility_off' : 'visibility'}</span>
            {isPreviewOpen ? 'Ẩn Xem trước' : 'Xem trước'}
          </button>
          <div className="w-px h-6 bg-surface-container-low mx-1"></div>
          <button className="px-6 py-2.5 rounded-xl font-bold text-xs text-on-surface-variant hover:bg-surface-container-high transition-all">
            Lưu nháp
          </button>
          <button className="px-8 py-2.5 rounded-xl font-bold text-xs text-white signature-gradient shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {isEdit ? 'Cập nhật Tour' : 'Xuất bản Tour'}
          </button>
        </div>
      </header>

      <div className="p-8 max-w-[1400px] mx-auto w-full">
        <div className={`grid gap-8 transition-all duration-500 ${isPreviewOpen ? 'grid-cols-1 lg:grid-cols-[1fr_380px]' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          
          {/* Main Form Column */}
          <div className="space-y-8">
            
            {/* Basic Info Section */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Thông tin cơ bản
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Tiêu đề Chuyến đi</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface font-bold text-base placeholder:text-slate-400 focus:ring-1 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="ví dụ: Vịnh Sapphire của Na Uy" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Mô tả chi tiết</label>
                  <textarea 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface leading-normal text-sm placeholder:text-slate-400 focus:ring-1 focus:ring-primary/20 transition-all outline-none min-h-[160px] resize-none font-medium" 
                    placeholder="Mô tả linh hồn của hành trình này..." 
                  />
                </div>
              </div>
            </section>

            {/* Media Section: Bento Grid Configuration */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Cấu hình ảnh Điểm đến (Bento Grid)
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Bố cục 1 ảnh chính lớn bên trái và 4 ảnh phụ nhỏ bên phải.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[400px]">
                {/* Hero Image */}
                <div className="md:col-span-8 relative group rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-all bg-surface-container-low/50 flex flex-col items-center justify-center">
                  {heroImage ? (
                    <>
                      <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <input 
                          className="w-full bg-white/10 backdrop-blur-md border-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/50 focus:ring-1 focus:ring-white outline-none" 
                          placeholder="Thay đổi URL Ảnh chính..." 
                          value={heroImage}
                          onChange={(e) => setHeroImage(e.target.value)}
                        />
                      </div>
                      <button onClick={() => setHeroImage('')} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 w-full max-w-sm">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl text-primary">add_photo_alternate</span>
                      </div>
                      <p className="text-sm font-black text-on-surface tracking-tight mb-3">Tải ảnh chính (Hero)</p>
                      <input 
                        className="w-full bg-white/80 border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-center shadow-sm" 
                        placeholder="Dán URL ảnh vào đây..." 
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Grid Images */}
                <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-2 gap-4 h-full">
                  {bentoImages.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-all bg-surface-container-low/50 flex flex-col items-center justify-center h-48 md:h-auto">
                      {img ? (
                        <>
                          <img src={img} alt={`Grid ${idx+1}`} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <input 
                              className="w-full bg-white/10 backdrop-blur-md border-none rounded-md px-2 py-1 text-[10px] text-white placeholder:text-white/50 focus:ring-1 focus:ring-white outline-none" 
                              placeholder="Thay URL..." 
                              value={img}
                              onChange={(e) => updateBentoImage(idx, e.target.value)}
                            />
                          </div>
                          <button onClick={() => updateBentoImage(idx, '')} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[10px]">close</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-2 w-full">
                          <span className="material-symbols-outlined text-xl text-slate-400 mb-1">image</span>
                          <p className="text-[10px] font-bold text-slate-500 mb-2">Ảnh {idx+1}</p>
                          <input 
                            className="w-full bg-white/80 border-none rounded-md px-2 py-1 text-[9px] focus:ring-1 focus:ring-primary outline-none shadow-sm" 
                            placeholder="Dán URL..." 
                            value={img}
                            onChange={(e) => updateBentoImage(idx, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Itinerary Builder */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  Lịch trình chi tiết
                </h3>
                <button 
                  onClick={addDay}
                  className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  Thêm hoạt động
                </button>
              </div>
              <div className="space-y-4">
                {itinerary.map((day, index) => (
                  <div key={day.id} className="p-6 rounded-2xl bg-surface-container-low/40 border-l-4 border-primary group transition-all">
                    <div className="flex gap-6 items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white font-black text-sm flex items-center justify-center shrink-0">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex gap-4">
                          <input 
                            className="bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-xs font-bold w-24 focus:ring-1 focus:ring-primary outline-none font-mono" 
                            type="time"
                            value={day.startTime}
                            onChange={(e) => {
                              const newItinerary = [...itinerary];
                              newItinerary[index].startTime = e.target.value;
                              setItinerary(newItinerary);
                            }}
                          />
                          <input 
                            className="flex-1 bg-transparent border-none text-base font-black tracking-tight p-0 focus:ring-0 placeholder:text-slate-300 transition-all outline-none" 
                            placeholder="Tiêu đề hoạt động..." 
                            type="text"
                          />
                        </div>
                        <textarea 
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs text-on-surface-variant leading-relaxed placeholder:text-slate-300 resize-none font-medium outline-none" 
                          placeholder="Mô tả chi tiết hoạt động..." 
                          rows={2}
                        />
                        
                        {/* Itinerary Activity Images */}
                        <div className="pt-4 border-t border-surface-container-low/50">
                          <div className="flex justify-between items-center mb-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hình ảnh hoạt động</label>
                            <button 
                              onClick={() => addImageToDay(index)}
                              className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[10px]">add_photo_alternate</span>
                              Thêm ảnh
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {day.images && day.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="space-y-2 group/img relative">
                                <div className="aspect-video rounded-lg overflow-hidden bg-surface-container-high relative">
                                  {img ? (
                                    <img src={img} alt="Activity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                                      <span className="material-symbols-outlined text-sm mb-1">image</span>
                                      Chưa có ảnh
                                    </div>
                                  )}
                                  <button 
                                    onClick={() => removeImageFromDay(index, imgIdx)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all scale-75 group-hover/img:scale-100"
                                  >
                                    <span className="material-symbols-outlined text-xs">close</span>
                                  </button>
                                </div>
                                <input 
                                  className="w-full bg-white/50 border-none rounded-lg px-2 py-1.5 text-[10px] focus:ring-1 focus:ring-primary outline-none font-medium" 
                                  placeholder="Dán URL ảnh vào đây..." 
                                  value={img}
                                  onChange={(e) => updateImageUrl(index, imgIdx, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeDay(day.id)}
                        className="p-1.5 text-slate-300 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Bao gồm & Không bao gồm
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Included */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Bao gồm
                    </h4>
                    <button onClick={() => addInclusion('included')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Thêm dòng</button>
                  </div>
                  <div className="space-y-2">
                    {inclusions.filter(inc => inc.type === 'included').map((inc) => (
                      <div key={inc.id} className="flex gap-2 group">
                        <input 
                          className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-emerald-500/20 outline-none" 
                          placeholder="VD: Phòng nghỉ sang trọng..."
                          value={inc.text}
                          onChange={(e) => {
                            const newInclusions = [...inclusions];
                            const target = newInclusions.find(i => i.id === inc.id);
                            if (target) target.text = e.target.value;
                            setInclusions(newInclusions);
                          }}
                        />
                        <button onClick={() => removeInclusion(inc.id)} className="p-1.5 text-slate-300 hover:text-error transition-all opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Excluded */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">cancel</span>
                      Không bao gồm
                    </h4>
                    <button onClick={() => addInclusion('excluded')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Thêm dòng</button>
                  </div>
                  <div className="space-y-2">
                    {inclusions.filter(inc => inc.type === 'excluded').map((inc) => (
                      <div key={inc.id} className="flex gap-2 group">
                        <input 
                          className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-red-500/20 outline-none" 
                          placeholder="VD: Đồ uống tự gọi..."
                          value={inc.text}
                          onChange={(e) => {
                            const newInclusions = [...inclusions];
                            const target = newInclusions.find(i => i.id === inc.id);
                            if (target) target.text = e.target.value;
                            setInclusions(newInclusions);
                          }}
                        />
                        <button onClick={() => removeInclusion(inc.id)} className="p-1.5 text-slate-300 hover:text-error transition-all opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Management Table */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Góc đánh giá
                </h3>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-lg text-[10px] font-bold">
                  <span className="material-symbols-outlined text-xs text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.9 (128)
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-surface-container-low">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low font-black text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Khách hàng</th>
                      <th className="px-5 py-3">Đánh giá</th>
                      <th className="px-5 py-3">Nội dung</th>
                      <th className="px-5 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low text-xs">
                    {[
                      { name: 'Lê Minh Anh', rating: 5, comment: 'Trải nghiệm tuyệt vời...' },
                      { name: 'David Wilson', rating: 4, comment: 'Magical bay...' }
                    ].map((review, i) => (
                      <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="px-5 py-4 font-bold">{review.name}</td>
                        <td className="px-5 py-4">
                          <div className="flex text-secondary gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <span key={j} className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: j < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-on-surface-variant max-w-[150px] truncate">{review.comment}</td>
                        <td className="px-5 py-4 text-right">
                          <button className="p-1.5 text-slate-300 hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-sm">visibility_off</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Secondary Config Column (Preview) */}
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.aside 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden lg:block space-y-6"
              >
                <div className="sticky top-28 space-y-6">
                  {/* Category Selection */}
                  <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
                    <h3 className="text-sm font-black tracking-tight mb-4 text-on-surface uppercase tracking-widest">Danh mục</h3>
                    <div className="flex flex-wrap gap-2">
                       {['Phiêu lưu', 'Sang trọng', 'Văn hóa', 'Sức khỏe'].map((cat, i) => (
                        <button 
                          key={i}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            cat === 'Phiêu lưu' 
                              ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-surface-container-low">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-5 rounded-full bg-slate-200 relative transition-all group-has-[:checked]:bg-primary">
                          <input checked type="checkbox" className="sr-only peer" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-all peer-checked:left-5.5 shadow-sm"></div>
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant">Chuyến đi nổi bật</span>
                      </label>
                    </div>
                  </section>

                  {/* Preview Card */}
                  <section className="p-6 rounded-[2rem] bg-indigo-900 text-white overflow-hidden relative shadow-2xl shadow-indigo-900/20 group">
                    <div className="absolute -top-6 -right-6 p-4 opacity-5">
                      <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-200 mb-4 px-1">Xem trước thẻ Tour</p>
                      <div className="aspect-[16/10] rounded-2xl bg-white/5 mb-4 overflow-hidden backdrop-blur-md border border-white/10">
                        <img src="https://picsum.photos/seed/santorini/800/600" alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <h4 className="text-lg font-black tracking-tight leading-tight mb-3">Vịnh Sapphire của Na Uy</h4>
                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-blue-100/60">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">schedule</span> 12 Ngày</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">payments</span> 2.499.000₫</span>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-surface-container-low mx-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-black tracking-tighter text-blue-900 dark:text-blue-100 mb-4">{BRAND_NAME}</h3>
            <p className="text-xs leading-relaxed text-slate-500 font-light italic">"Defined by Discovery, Crafted by Curators."</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-100">Liên kết nhanh</h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              <li><Link className="hover:text-primary transition-colors" to="/admin/tours">Danh sách Tour</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/admin/orders">Đơn hàng mới</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-100">Hỗ trợ kỹ thuật</h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              <li><Link className="hover:text-primary transition-colors" to="#">Tài liệu hướng dẫn</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Gửi yêu cầu giúp đỡ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-100">Hệ thống</h4>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-500">Toàn bộ máy chủ hoạt động tốt</span>
            </div>
          </div>
        </div>
        <div className="px-8 py-6 border-t border-surface-container-low flex justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 {BRAND_NAME} Admin. Professional Edition.</p>
        </div>
      </footer>
    </div>
  );
}
