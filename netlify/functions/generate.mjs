export default async (request) => {
  if(request.method!=='POST') return Response.json({error:'Method not allowed'},{status:405});
  const key=process.env.GEMINI_API_KEY;
  if(!key)return Response.json({error:'Chưa cấu hình GEMINI_API_KEY trên Netlify'},{status:503});
  try{
    const p=await request.json();
    const modes={gvg:'Dự thi giáo viên giỏi: lời thoại chi tiết, điểm nhấn và tình huống sư phạm',daily:'Dạy song ngữ thường ngày: gọn, khả thi, câu tiếng Anh ngắn',demo:'Chuyên đề minh họa: chú giải phương pháp, phiếu quan sát và câu hỏi thảo luận'};
    const instruction=`Bạn là chuyên gia giáo dục tiểu học Việt Nam và CLIL. Soạn kế hoạch bài dạy song ngữ Việt-Anh bằng tiếng Việt, dùng lời thoại tiếng Anh ngắn và nghĩa Việt. Không bịa dữ kiện, số liệu, đáp án; đánh dấu phần chưa chắc chắn để giáo viên kiểm tra. Không biến môn học thành tiết tiếng Anh. Trình bày rõ mục tiêu, chuẩn bị, bảng hai cột Hoạt động GV và Hoạt động HS (dùng Markdown table), thời lượng từng hoạt động cộng đúng tổng, từ vựng, đánh giá. Hình thức: ${modes[p.mode]||modes.daily}. Lớp ${p.grade}, môn ${p.subject}, sách ${p.books}, ${p.minutes} phút, trình độ ${p.level}, tích hợp ${p.ratio}. Đặc điểm HS: ${p.students}. Nội dung: ${p.content}. Nếu có tài liệu đính kèm, đọc tài liệu trước khi soạn.`;
    const parts=[{text:instruction}];
    for(const f of (p.files||[]).slice(0,4)){
      if(!['image/png','image/jpeg','image/webp','application/pdf'].includes(f.type))return Response.json({error:'AI hiện nhận trực tiếp ảnh và PDF. Với DOCX, hãy dán nội dung vào ô văn bản.'},{status:400});
      parts.push({inline_data:{mime_type:f.type,data:f.data}});
    }
    const model=process.env.GEMINI_MODEL||'gemini-3.5-flash-lite';
    const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{role:'user',parts}],generationConfig:{maxOutputTokens:7500}})});
    const data=await res.json();if(!res.ok)throw Error(data.error?.message||'AI API error');
    const result=(data.candidates?.[0]?.content?.parts||[]).map(x=>x.text||'').join('\n');
    if(!result)throw Error('AI không trả về nội dung');
    return Response.json({text:result});
  }catch(e){return Response.json({error:String(e.message||e)},{status:500})}
};
export const config={path:'/.netlify/functions/generate'};
