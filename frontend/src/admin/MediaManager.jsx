import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { uploadImage } from "../services/uploadService";
import { FaTrash, FaUpload, FaCopy } from "react-icons/fa";

export default function MediaManager() {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState("");
  const [uploading,setUploading]= useState(false);
  const [confirm,  setConfirm]  = useState(null);
  const fileRef = useRef();

  const load = () => { setLoading(true); API.get("/media").then(r=>setImages(r.data?.media||[])).catch(()=>setImages([])).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[]);
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData(); fd.append("image", file); await API.post("/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      showToast(`${files.length} file(s) uploaded!`); load();
    } catch { showToast("Upload failed."); }
    finally { setUploading(false); e.target.value=""; }
  };

  const handleDelete = async (id) => {
    try { await API.delete("/media/"+id); setImages(p=>p.filter(x=>x._id!==id)); showToast("Deleted."); }
    catch { showToast("Delete failed."); }
    setConfirm(null);
  };

  const copy = (url) => { navigator.clipboard.writeText(url); showToast("URL copied!"); };

  return (
    <div>
      {toast && <div className="adm-toast">{toast}</div>}
      {confirm && (
        <div className="adm-modal-bg"><div className="adm-modal">
          <p>Delete this image? Cannot be undone.</p>
          <div className="adm-modal-btns">
            <button className="adm-btn adm-btn-danger"    onClick={()=>handleDelete(confirm._id)}>Delete</button>
            <button className="adm-btn adm-btn-secondary" onClick={()=>setConfirm(null)}>Cancel</button>
          </div>
        </div></div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 className="adm-section-title" style={{marginBottom:0}}>Media Library</h2>
        <button className="adm-btn adm-btn-primary" onClick={()=>fileRef.current.click()} disabled={uploading}>
          <FaUpload /> {uploading?"Uploading...":"Upload Images"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleUpload} />
      </div>
      {loading ? <div className="adm-loading">Loading...</div>
      : images.length===0 ? <div className="adm-empty">No media yet. Upload images above.</div>
      : (
        <div className="adm-media-grid">
          {images.map(img=>(
            <div key={img._id} className="adm-media-card">
              <img src={img.url||img.path} alt={img.name||"media"} />
              <div className="adm-media-actions">
                <button className="adm-icon-btn view" onClick={()=>copy(img.url||img.path)} title="Copy URL"><FaCopy /></button>
                <button className="adm-icon-btn delete" onClick={()=>setConfirm(img)} title="Delete"><FaTrash /></button>
              </div>
              <div className="adm-media-name">{img.name||img.filename||"image"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



