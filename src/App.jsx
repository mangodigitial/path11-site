import { useState, useEffect, useRef } from "react";

// ═══ CONFIG ═══
const SUPABASE_URL = "https://syulluspsmxpgjajbvyy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dWxsdXNwc214cGdqYWpidnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Nzc4NzcsImV4cCI6MjA4ODA1Mzg3N30.ORoUY8jqY3X6Jz-PHpEJW_3HCxFjdpXS5oc9Fk0Tyhg";

const db = {
  async load(k, fb) { try { const r = await fetch(`${SUPABASE_URL}/rest/v1/content?key=eq.${encodeURIComponent(k)}&select=value`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }); const rows = await r.json(); return rows?.length > 0 ? JSON.parse(rows[0].value) : fb; } catch { return fb; } },
  async save(k, d) { try { await fetch(`${SUPABASE_URL}/rest/v1/content`, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" }, body: JSON.stringify({ key: k, value: JSON.stringify(d) }) }); } catch {} },
};

// ═══ VIDEO HELPERS ═══
const getThumb = (id, pl = "vimeo") => pl === "youtube" ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : `https://vumbnail.com/${id}.jpg`;
const getEmbed = (id, pl = "vimeo", bg = false) => {
  if (pl === "youtube") return bg ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0` : `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
  return bg ? `https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p` : `https://player.vimeo.com/video/${id}?byline=0&portrait=0&title=0&color=ffffff`;
};
const vid = i => i.videoId || i.vimeoId || "";
const pl = i => i.platform || "vimeo";

// ═══ DEFAULTS ═══
const DEF_CONFIG = { heroVideoId: "305162807", heroPlatform: "vimeo", contactEmail: "hello@path11.studio", adminPin: "1111", aboutLine1: "Path 11 is a cinematic production studio based in London, creating visual narratives for the world's most prestigious hospitality and real estate brands.", aboutLine2: "We combine traditional cinema craft with cutting-edge AI video technology. From sweeping aerial brand films to vertical-first social content to generative AI sequences — we meet your audience wherever they are, with content that stops the scroll and commands attention.", philosophy: "We believe the finest properties deserve to be experienced, not just seen. Every project begins with immersion — we spend time in your space, understanding the light, the rhythm, the story it wants to tell. Only then do we pick up a camera.", contactIntro: "Whether you're launching a new property, repositioning a brand, or simply want to explore what's possible — we'd love to hear from you.", officeAddress: "Studio 4, 12 Rivington Street\nLondon EC2A 3DU\nUnited Kingdom", officePhone: "+44 (0)20 7946 0958" };

const DEF_PROJECTS = [
  { id:"p1",title:"The Aman Nai Lert",location:"Bangkok",category:"Luxury Hotel",year:"2025",color:"#D4A574",videoId:"305162807",platform:"vimeo",description:"A cinematic brand film capturing the essence of Aman's newest urban sanctuary. Shot over five days across the property's lush gardens, serene spa, and world-class dining spaces.",duration:"2:30",format:"4K HDR",deliverables:"Brand Film, Social Cuts, Photography" },
  { id:"p2",title:"One Barangaroo",location:"Sydney",category:"Real Estate",year:"2025",color:"#7BA3C9",videoId:"305162807",platform:"vimeo",description:"Launch film for Sydney's most ambitious residential tower. Aerial sequences and intimate interior moments combine to tell the story of harbourside living at its finest.",duration:"3:15",format:"6K",deliverables:"Launch Film, Aerial Package, Lifestyle Edits" },
  { id:"p3",title:"Rosewood Miramar",location:"Montecito",category:"Resort Film",year:"2024",color:"#C9A87B",videoId:"305162807",platform:"vimeo",description:"A golden-hour portrait of California's most coveted coastal retreat.",duration:"2:00",format:"4K HDR",deliverables:"Brand Film, Social Reels, Website Content" },
  { id:"p4",title:"The Lana Dubai",location:"Dubai",category:"Hotel Launch",year:"2024",color:"#A8B5A0",videoId:"305162807",platform:"vimeo",description:"Pre-opening campaign for Dorchester Collection's first Middle Eastern property.",duration:"4:00",format:"8K",deliverables:"Hero Film, Teaser, BTS Documentary" },
  { id:"p5",title:"Park Hyatt Kyoto",location:"Japan",category:"Brand Film",year:"2024",color:"#B8A9C4",videoId:"305162807",platform:"vimeo",description:"An atmospheric journey through Kyoto's seasons, woven with the quiet precision of Japanese hospitality.",duration:"3:30",format:"4K",deliverables:"Seasonal Brand Film, Photography" },
  { id:"p6",title:"Mandarin Oriental",location:"Lago di Como",category:"Luxury Hotel",year:"2023",color:"#C4B5A0",videoId:"305162807",platform:"vimeo",description:"A love letter to Lake Como's timeless beauty, told through the lens of one of the world's great hotel brands.",duration:"2:45",format:"4K HDR",deliverables:"Brand Film, Drone Package, Social Content" },
];

const DEF_REELS = [
  { id:"r1",title:"Suite Reveal",client:"Aman Tokyo",videoId:"305162807",platform:"vimeo" },
  { id:"r2",title:"Lobby at Dawn",client:"The Lana Dubai",videoId:"305162807",platform:"vimeo" },
  { id:"r3",title:"Rooftop Infinity",client:"One Barangaroo",videoId:"305162807",platform:"vimeo" },
  { id:"r4",title:"Golden Hour Pool",client:"Rosewood Miramar",videoId:"305162807",platform:"vimeo" },
  { id:"r5",title:"Spa Ritual",client:"Park Hyatt Kyoto",videoId:"305162807",platform:"vimeo" },
  { id:"r6",title:"Penthouse Tour",client:"Mandarin Oriental",videoId:"305162807",platform:"vimeo" },
];

const DEF_AI = [
  { id:"a1",title:"Impossible Flythrough",client:"Aman Concept",videoId:"305162807",platform:"vimeo",technique:"Neural Radiance",aspect:"16/9" },
  { id:"a2",title:"Dreamscape Lobby",client:"Path 11 Original",videoId:"305162807",platform:"vimeo",technique:"Generative AI",aspect:"9/16" },
  { id:"a3",title:"Liquid Architecture",client:"Rosewood Vision",videoId:"305162807",platform:"vimeo",technique:"Diffusion Model",aspect:"16/9" },
  { id:"a4",title:"Time Collapse",client:"One Barangaroo",videoId:"305162807",platform:"vimeo",technique:"Temporal AI",aspect:"9/16" },
  { id:"a5",title:"Phantom Suite",client:"The Lana Concept",videoId:"305162807",platform:"vimeo",technique:"Generative AI",aspect:"16/9" },
  { id:"a6",title:"Gravity Shift",client:"Path 11 Original",videoId:"305162807",platform:"vimeo",technique:"Neural Radiance",aspect:"9/16" },
];

const DEF_SERVICES = [
  { id:"s1",num:"01",title:"Cinematic Brand Films",desc:"Story-driven narratives that define luxury experiences. 4K/8K capture with cinema-grade equipment.",tag:"" },
  { id:"s2",num:"02",title:"Aerial & Drone",desc:"Licensed FPV and cinematic drone operations. Sweeping reveals that capture the grandeur of your property.",tag:"" },
  { id:"s3",num:"03",title:"Social Media Content",desc:"Vertical 9:16 reels, stories, and short-form content engineered for engagement.",tag:"9:16" },
  { id:"s4",num:"04",title:"AI Video & Generative",desc:"Next-generation AI-powered video. Concept visualisation, impossible camera moves, and dreamlike sequences.",tag:"NEW" },
  { id:"s5",num:"05",title:"Post Production",desc:"Hollywood-grade colour science, sound design, and visual effects.",tag:"" },
  { id:"s6",num:"06",title:"Photography",desc:"Architectural and lifestyle photography with the same cinematic eye we bring to motion.",tag:"" },
];

const DEF_TEAM = [
  { id:"t1",name:"Alex Morgan",role:"Founder & Director",bio:"15 years in cinematic production. Previously shot for Four Seasons, Aman, and Rosewood globally." },
  { id:"t2",name:"Suki Tanaka",role:"Director of Photography",bio:"Award-winning DP with a background in feature films. Specialist in natural light and architectural storytelling." },
  { id:"t3",name:"James Osei",role:"Head of Post",bio:"Colour scientist and editor. Formerly at MPC and Framestore. Obsessive about every single frame." },
  { id:"t4",name:"Lena Vogt",role:"AI & Creative Tech",bio:"Pushing the boundaries of generative video. Background in computational design and machine learning." },
];

const M = "'SF Mono','Fira Code','Consolas',monospace";
const F = "'Inter','Helvetica Neue',-apple-system,sans-serif";
const getRoute = () => window.location.hash.slice(1) || "/";
const navigate = (path) => { window.location.hash = path; window.scrollTo(0, 0); };

// ═══ HOOKS ═══
const useMobile = () => {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const h = () => setM(window.innerWidth < 768); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return m;
};

const useIsTouch = () => {
  const [t, setT] = useState(false);
  useEffect(() => { const h = () => setT(true); window.addEventListener("touchstart", h, { once: true }); return () => window.removeEventListener("touchstart", h); }, []);
  return t;
};

// ═══ VIDEO COMPONENTS ═══
const VideoBg = ({ videoId, platform }) => (
  <div style={{ position:"absolute",inset:0,overflow:"hidden",zIndex:0 }}>
    <iframe src={getEmbed(videoId,platform,true)} style={{ position:"absolute",top:"50%",left:"50%",width:"max(177.78vh,100vw)",height:"max(56.25vw,100vh)",transform:"translate(-50%,-50%)",border:"none",pointerEvents:"none" }} allow="autoplay;fullscreen;accelerometer;gyroscope" title="bg" />
  </div>
);

const VideoEmbed = ({ videoId, platform, aspect="16/9", style={} }) => (
  <div style={{ position:"relative",aspectRatio:aspect,width:"100%",overflow:"hidden",background:"#000",borderRadius:2,...style }}>
    <iframe src={getEmbed(videoId,platform,false)} style={{ position:"absolute",inset:0,width:"100%",height:"100%",border:"none" }} allow="autoplay;fullscreen;picture-in-picture;accelerometer;gyroscope" allowFullScreen title="vid" />
  </div>
);

// ═══ PRIMITIVES ═══
const Cursor = () => {
  const [p,setP]=useState({x:-100,y:-100}); const [h,setH]=useState(false); const [hd,setHd]=useState(true);
  const isTouch = useIsTouch();
  useEffect(()=>{
    const m=e=>{setP({x:e.clientX,y:e.clientY});setHd(false)}; const l=()=>setHd(true);
    const c=e=>{const t=e.target;setH(t.tagName==="A"||t.tagName==="BUTTON"||t.closest("a")||t.closest("button")||t.closest("[data-hover]")||t.closest("iframe")||t.tagName==="INPUT"||t.tagName==="TEXTAREA")};
    window.addEventListener("mousemove",m);window.addEventListener("mousemove",c);document.addEventListener("mouseleave",l);
    return()=>{window.removeEventListener("mousemove",m);window.removeEventListener("mousemove",c);document.removeEventListener("mouseleave",l)};
  },[]);
  if(hd||isTouch) return null;
  return (<>
    <div style={{position:"fixed",left:p.x,top:p.y,width:h?56:12,height:h?56:12,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.9)",pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)",transition:"width .3s cubic-bezier(.22,1,.36,1),height .3s cubic-bezier(.22,1,.36,1)",background:h?"rgba(255,255,255,0.06)":"transparent",mixBlendMode:"difference"}} />
    <div style={{position:"fixed",left:p.x,top:p.y,width:4,height:4,borderRadius:"50%",background:"#fff",pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)",mixBlendMode:"difference"}} />
  </>);
};

const Mag = ({ children, style, onClick }) => {
  const ref=useRef(null); const [o,setO]=useState({x:0,y:0}); const isTouch=useIsTouch();
  const hm=e=>{if(isTouch)return;const r=ref.current.getBoundingClientRect();setO({x:(e.clientX-r.left-r.width/2)*0.2,y:(e.clientY-r.top-r.height/2)*0.2})};
  return <button ref={ref} data-hover onMouseMove={hm} onMouseLeave={()=>setO({x:0,y:0})} onClick={onClick} style={{...style,transform:`translate(${o.x}px,${o.y}px)`,transition:"transform .4s cubic-bezier(.22,1,.36,1)",cursor:isTouch?"pointer":"none"}}>{children}</button>;
};

const Reveal = ({children,delay=0,style={}}) => {
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
  return <div ref={ref} style={{overflow:"hidden",...style}}><div style={{transform:v?"translateY(0)":"translateY(100%)",opacity:v?1:0,transition:`transform .9s cubic-bezier(.22,1,.36,1) ${delay}s,opacity .9s cubic-bezier(.22,1,.36,1) ${delay}s`}}>{children}</div></div>;
};

const Fade = ({children,delay=0,style={}}) => {
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.05});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
  return <div ref={ref} style={{...style,opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:`all .8s cubic-bezier(.22,1,.36,1) ${delay}s`}}>{children}</div>;
};

const Count = ({end,suffix=""}) => {
  const[v,setV]=useState(0);const ref=useRef(null);const s=useRef(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!s.current){s.current=true;let st=0;const step=ts=>{if(!st)st=ts;const p=Math.min((ts-st)/2000,1);setV(Math.round((1-Math.pow(1-p,4))*end));if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}},{threshold:0.5});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[end]);
  return <span ref={ref}>{v}{suffix}</span>;
};

const Lbl = ({children})=><span style={{fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",fontFamily:M}}>{children}</span>;

// ═══ NAV (responsive) ═══
const Nav = ({ scrollY, cmsOpen, onHome }) => {
  const mob = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const isTouch = useIsTouch();
  const cur = isTouch ? "pointer" : "none";

  return (<>
    <nav style={{
      position:"fixed",top:0,left:0,right:cmsOpen?"min(460px,92vw)":0,zIndex:100,padding:mob?"16px 20px":"24px 40px",
      display:"flex",justifyContent:"space-between",alignItems:"center",transition:"right .3s",
      background:scrollY>50||menuOpen?"rgba(6,6,6,0.95)":"transparent",backdropFilter:scrollY>50||menuOpen?"blur(20px) saturate(1.4)":"none",
      borderBottom:scrollY>50?"1px solid rgba(255,255,255,0.04)":"1px solid transparent",
    }}>
      <div data-hover onClick={()=>{onHome();setMenuOpen(false)}} style={{cursor:cur,display:"flex",alignItems:"center",gap:10}}>
        <svg width={mob?22:28} height={mob?22:28} viewBox="0 0 28 28" fill="none"><path d="M2 14 L14 2 L26 14" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.9"/><path d="M8 14 L14 8 L20 14" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.5"/><line x1="14" y1="14" x2="14" y2="26" stroke="#fff" strokeWidth="1.5" opacity="0.7"/></svg>
        <span style={{fontWeight:200,fontSize:mob?13:16,letterSpacing:"0.15em",textTransform:"uppercase"}}>Path 11</span>
      </div>
      {mob ? (
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",padding:8,zIndex:101}}>
          {menuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{display:"flex",gap:30,alignItems:"center"}}>
          {["Work","About","Contact"].map(item=>(
            <a key={item} data-hover onClick={()=>item==="Work"?onHome():navigate(`/${item.toLowerCase()}`)}
              style={{color:"rgba(255,255,255,0.5)",fontSize:12,letterSpacing:"0.12em",textTransform:"uppercase",textDecoration:"none",cursor:cur,fontWeight:400,transition:"color .3s"}}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.5)"}>{item}</a>
          ))}
          <Mag style={{background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",padding:"10px 24px",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:F,borderRadius:0}}>Showreel</Mag>
        </div>
      )}
    </nav>
    {/* Mobile menu overlay */}
    {mob && menuOpen && (
      <div style={{position:"fixed",inset:0,zIndex:99,background:"rgba(6,6,6,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:30}}>
        {["Work","About","Contact"].map(item=>(
          <a key={item} onClick={()=>{item==="Work"?onHome():navigate(`/${item.toLowerCase()}`);setMenuOpen(false)}}
            style={{color:"#fff",fontSize:24,fontWeight:200,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",cursor:"pointer"}}>{item}</a>
        ))}
        <button onClick={()=>setMenuOpen(false)} style={{marginTop:20,background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",padding:"14px 36px",fontSize:13,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:F,borderRadius:0,cursor:"pointer"}}>Showreel</button>
      </div>
    )}
  </>);
};

const Footer = () => {
  const mob = useMobile();
  return (
    <footer style={{padding:mob?"30px 20px":"40px 60px",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",alignItems:mob?"flex-start":"center",gap:mob?16:0}}>
      <div style={{display:"flex",gap:20}}>
        {["Instagram","Vimeo","LinkedIn"].map(s=><a key={s} style={{fontSize:11,color:"rgba(255,255,255,0.25)",textDecoration:"none",letterSpacing:"0.1em",textTransform:"uppercase"}}>{s}</a>)}
      </div>
      <span style={{fontSize:11,color:"rgba(255,255,255,0.15)",fontFamily:M}}>© 2025 Path 11 Studio</span>
    </footer>
  );
};

// ═══ PAGE: HOME ═══
const HomePage = ({ config, projects, reels, aiVideos, services, setSelectedReel, setSelectedAI }) => {
  const mob = useMobile();
  const isTouch = useIsTouch();
  const px = mob ? 20 : 60;
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState("");
  useEffect(()=>{setTimeout(()=>setLoaded(true),300)},[]);
  useEffect(()=>{const t=()=>setTime(new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"}));t();const iv=setInterval(t,30000);return()=>clearInterval(iv)},[]);

  const scrollRef=useRef(null);const[sp,setSp]=useState(0);const[ai,setAi]=useState(0);
  const drag=useRef({isDown:false,startX:0,scrollLeft:0,dragged:false});
  const hs=()=>{const el=scrollRef.current;if(!el)return;const max=el.scrollWidth-el.clientWidth;if(max<=0)return;setSp(el.scrollLeft/max);setAi(Math.round((el.scrollLeft/max)*(projects.length-1)))};
  const ds=e=>{if(isTouch)return;const el=scrollRef.current;drag.current={isDown:true,startX:e.pageX-el.offsetLeft,scrollLeft:el.scrollLeft,dragged:false};el.style.scrollSnapType="none"};
  const de=()=>{drag.current.isDown=false;const el=scrollRef.current;if(el)el.style.scrollSnapType="x mandatory"};
  const dm=e=>{if(!drag.current.isDown)return;e.preventDefault();const el=scrollRef.current;const x=e.pageX-el.offsetLeft;const walk=(x-drag.current.startX)*1.5;if(Math.abs(walk)>5)drag.current.dragged=true;el.scrollLeft=drag.current.scrollLeft-walk};
  const cc=p=>{if(!drag.current.dragged||isTouch)navigate(`/project/${p.id}`)};

  return (<>
    {/* Hero */}
    <section style={{height:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:`0 ${px}px ${mob?50:80}px`,position:"relative",overflow:"hidden"}}>
      <VideoBg videoId={config.heroVideoId} platform={config.heroPlatform}/>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(180deg,rgba(6,6,6,0.5) 0%,rgba(6,6,6,0.15) 35%,rgba(6,6,6,0.3) 65%,rgba(6,6,6,0.95) 100%)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"radial-gradient(ellipse at center,transparent 50%,rgba(6,6,6,0.5) 100%)"}}/>
      <div style={{position:"absolute",inset:0,zIndex:2,opacity:0.035,pointerEvents:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
      {!mob&&<div style={{position:"absolute",top:100,left:60,display:"flex",gap:40,zIndex:5,opacity:loaded?1:0,transition:"opacity 1.5s ease 1s"}}>
        {[{l:"Status",v:"Available"},{l:"London",v:time},{l:"Est.",v:"2024"}].map(({l,v})=>(
          <div key={l}><div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",fontFamily:M,marginBottom:4}}>{l}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:M,fontWeight:300}}>{v}</div></div>
        ))}
      </div>}
      <div style={{position:"relative",zIndex:5}}>
        {[{text:"We craft",color:"#fff",delay:0.3},{text:"visual worlds",gradient:true,delay:0.5},{text:"for luxury brands.",color:"rgba(255,255,255,0.3)",delay:0.7}].map(({text,color,gradient,delay})=>(
          <div key={text} style={{overflow:"hidden",marginBottom:mob?4:8}}>
            <h1 style={{fontSize:mob?"clamp(32px,12vw,56px)":"clamp(48px,9vw,140px)",fontWeight:200,letterSpacing:"-0.04em",lineHeight:0.92,margin:0,...(gradient?{background:"linear-gradient(135deg,#D4A574 0%,#fff 50%,#7BA3C9 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{color}),transform:loaded?"translateY(0)":"translateY(100%)",transition:`transform 1.2s cubic-bezier(.22,1,.36,1) ${delay}s`}}>{text}</h1>
          </div>
        ))}
      </div>
      <p style={{fontSize:mob?13:15,fontWeight:300,color:"rgba(255,255,255,0.45)",maxWidth:480,marginTop:mob?24:40,lineHeight:1.7,position:"relative",zIndex:5,opacity:loaded?1:0,transition:"opacity 1.5s ease 1.2s"}}>Cinematic production, social content & AI video for the world's most discerning hotels, residences and real estate brands.</p>
      {!mob&&<div style={{position:"absolute",bottom:30,right:60,zIndex:5,display:"flex",flexDirection:"column",alignItems:"center",gap:10,opacity:loaded?1:0,transition:"opacity 1.5s ease 1.8s"}}>
        <span style={{fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",fontFamily:M,writingMode:"vertical-rl"}}>Scroll</span>
        <div style={{width:1,height:50,background:"rgba(255,255,255,0.1)",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,width:"100%",height:"40%",background:"rgba(255,255,255,0.5)",animation:"scrollLine 2s ease-in-out infinite"}}/></div>
      </div>}
    </section>

    {/* Stats */}
    <section style={{display:"flex",justifyContent:"center",gap:mob?"clamp(24px,8vw,40px)":"clamp(40px,8vw,120px)",padding:mob?"40px 20px":"60px 40px",borderTop:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)",flexWrap:"wrap"}}>
      {[{n:47,s:"",l:"Projects"},{n:12,s:"",l:"Countries"},{n:100,s:"%",l:"Referral Rate"}].map(({n,s,l})=>(
        <div key={l} style={{textAlign:"center"}}><div style={{fontSize:mob?"clamp(24px,8vw,36px)":"clamp(32px,5vw,56px)",fontWeight:200,letterSpacing:"-0.03em"}}><Count end={n} suffix={s}/></div><div style={{fontSize:mob?8:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",fontFamily:M,marginTop:6}}>{l}</div></div>
      ))}
    </section>

    {/* Work */}
    <section style={{padding:mob?"60px 0 40px":"120px 0 80px"}}>
      <div style={{padding:`0 ${px}px`,marginBottom:mob?30:60,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><Reveal><Lbl>Selected Work</Lbl></Reveal><Reveal delay={0.1}><h2 style={{fontSize:mob?"clamp(24px,8vw,36px)":"clamp(32px,5vw,60px)",fontWeight:200,letterSpacing:"-0.03em",margin:"8px 0 0"}}>Featured Projects</h2></Reveal></div>
        {!mob&&<div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Fade delay={0.3}><span style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontFamily:M}}>Drag to explore</span></Fade>
          <Fade delay={0.4}><div style={{display:"flex",gap:8}}>
            <button data-hover onClick={()=>{const el=scrollRef.current;if(el)el.scrollBy({left:-550,behavior:"smooth"})}} style={{width:40,height:40,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#fff",fontSize:16,cursor:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
            <button data-hover onClick={()=>{const el=scrollRef.current;if(el)el.scrollBy({left:550,behavior:"smooth"})}} style={{width:40,height:40,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#fff",fontSize:16,cursor:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
          </div></Fade>
        </div>}
      </div>
      <div style={{position:"relative"}}>
        <style>{`.p11-scroll::-webkit-scrollbar{display:none} .p11-scroll{-ms-overflow-style:none} .p11-card img{transition:opacity .6s ease,transform 8s ease} .p11-card:hover img{opacity:1;transform:scale(1.05)}`}</style>
        <div ref={scrollRef} className="p11-scroll" onScroll={hs} onMouseDown={ds} onMouseUp={de} onMouseLeave={de} onMouseMove={dm} style={{display:"flex",gap:mob?16:30,overflowX:"auto",padding:`20px ${px}px 40px`,scrollSnapType:"x mandatory",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",cursor:isTouch?"auto":"grab",userSelect:"none"}}>
          {projects.map(p=>(
            <div key={p.id} className="p11-card" data-hover onClick={()=>cc(p)} style={{flex:`0 0 ${mob?"min(300px,80vw)":"min(520px,75vw)"}`,scrollSnapAlign:"center",cursor:isTouch?"pointer":"none",borderRadius:4,overflow:"hidden"}}>
              <div style={{aspectRatio:"16/10",background:`linear-gradient(135deg,${p.color}22 0%,#0a0a0a 60%,${p.color}11 100%)`,position:"relative",overflow:"hidden"}}>
                <img src={getThumb(vid(p),pl(p))} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.6,pointerEvents:"none"}} onError={e=>{e.target.style.display="none"}}/>
                <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${p.color}33 0%,rgba(0,0,0,0.4) 50%,${p.color}22 100%)`,zIndex:1}}/>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:mob?40:56,height:mob?40:56,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.05)",zIndex:2}}>
                  <div style={{width:0,height:0,borderLeft:`${mob?12:16}px solid rgba(255,255,255,0.85)`,borderTop:`${mob?7:9}px solid transparent`,borderBottom:`${mob?7:9}px solid transparent`,marginLeft:2}}/>
                </div>
                <div style={{position:"absolute",top:mob?12:20,left:mob?12:20,fontSize:mob?8:10,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.7)",fontFamily:M,zIndex:2}}>{p.category}</div>
              </div>
              <div style={{padding:"14px 0 0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <h3 style={{fontFamily:F,fontWeight:300,fontSize:mob?16:20,color:"#fff",margin:0}}>{p.title}</h3>
                  <span style={{fontFamily:M,fontSize:11,color:"rgba(255,255,255,0.3)"}}>{p.year}</span>
                </div>
                <p style={{fontFamily:F,fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:4,fontWeight:300}}>{p.location}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16,padding:`0 ${px}px`,marginTop:6}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}><div style={{height:"100%",background:"rgba(255,255,255,0.4)",width:`${Math.max(10,sp*100)}%`,transition:"width .1s"}}/></div>
          <span style={{fontFamily:M,fontSize:11,color:"rgba(255,255,255,0.3)"}}>{String(ai+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span>
        </div>
      </div>
    </section>

    {/* Reels */}
    <section style={{padding:`${mob?60:120}px ${px}px`,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
      <Reveal><Lbl>Short Form — 9:16</Lbl></Reveal>
      <Reveal delay={0.1}><h2 style={{fontSize:mob?"clamp(24px,8vw,36px)":"clamp(32px,5vw,60px)",fontWeight:200,letterSpacing:"-0.03em",margin:"8px 0 0"}}>Social Reels</h2></Reveal>
      <Fade delay={0.2}><p style={{fontSize:mob?13:15,fontWeight:300,color:"rgba(255,255,255,0.4)",maxWidth:520,lineHeight:1.7,margin:`12px 0 ${mob?30:50}px`}}>Vertical-first content engineered for maximum engagement.</p></Fade>
      <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(auto-fill,minmax(190px,1fr))",gap:mob?12:20}}>
        {reels.map((r,i)=>(
          <Fade key={r.id} delay={i*0.06}>
            <div onClick={()=>setSelectedReel(r)} style={{cursor:"pointer",borderRadius:6,overflow:"hidden",background:"#0a0a0a"}}>
              <div style={{aspectRatio:"9/16",position:"relative",overflow:"hidden"}}>
                <img src={getThumb(vid(r),pl(r))} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.5}} onError={e=>{e.target.style.display="none"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(212,165,116,0.1) 0%,rgba(0,0,0,0.3) 50%,rgba(123,163,201,0.08) 100%)",zIndex:1}}/>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)",zIndex:2}}>
                  <div style={{width:0,height:0,borderLeft:"9px solid rgba(255,255,255,0.7)",borderTop:"5px solid transparent",borderBottom:"5px solid transparent",marginLeft:2}}/>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",background:"linear-gradient(transparent,rgba(0,0,0,0.8))",zIndex:2}}/>
                <div style={{position:"absolute",bottom:mob?10:14,left:mob?10:14,right:mob?10:14,zIndex:3}}>
                  <div style={{fontSize:mob?12:14,fontWeight:400,color:"#fff",marginBottom:2}}>{r.title}</div>
                  <div style={{fontSize:mob?8:10,color:"rgba(255,255,255,0.4)",fontFamily:M,letterSpacing:"0.1em",textTransform:"uppercase"}}>{r.client}</div>
                </div>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </section>

    {/* AI Video */}
    <section style={{padding:`${mob?60:120}px ${px}px`,position:"relative",overflow:"hidden",background:"linear-gradient(180deg,rgba(6,6,6,1) 0%,rgba(15,8,30,1) 30%,rgba(10,6,20,1) 70%,rgba(6,6,6,1) 100%)"}}>
      <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(120,80,200,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2}}>
        <Reveal><div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(160,130,220,0.5)",fontFamily:M}}>Next Generation</span><span style={{background:"linear-gradient(135deg,rgba(120,80,200,0.4),rgba(80,120,220,0.3))",padding:"3px 10px",fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.8)",fontFamily:M,borderRadius:3}}>✦ AI</span></div></Reveal>
        <Reveal delay={0.1}><h2 style={{fontSize:mob?"clamp(24px,8vw,36px)":"clamp(32px,5vw,60px)",fontWeight:200,letterSpacing:"-0.03em",margin:"8px 0 0"}}><span style={{background:"linear-gradient(135deg,#a080e0 0%,#fff 40%,#6090d0 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI Video</span></h2></Reveal>
        <Fade delay={0.2}><p style={{fontSize:mob?13:15,fontWeight:300,color:"rgba(180,160,220,0.5)",maxWidth:560,lineHeight:1.7,margin:`12px 0 ${mob?30:50}px`}}>Concept visualisation, impossible camera moves, and dreamlike sequences.</p></Fade>
        <div style={{columnCount:mob?2:3,columnGap:mob?12:20,maxWidth:1100}}>
          {aiVideos.map((v,i)=>(
            <Fade key={v.id} delay={i*0.08}>
              <div onClick={()=>setSelectedAI(v)} style={{cursor:"pointer",borderRadius:6,overflow:"hidden",background:"#0a0a0a",marginBottom:mob?12:20,breakInside:"avoid"}}>
                <div style={{aspectRatio:v.aspect,position:"relative",overflow:"hidden"}}>
                  <img src={getThumb(vid(v),pl(v))} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.4}} onError={e=>{e.target.style.display="none"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(26,10,46,0.6) 0%,rgba(0,0,0,0.3) 40%,rgba(120,80,200,0.2) 100%)",zIndex:1}}/>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:v.aspect==="16/9"?48:34,height:v.aspect==="16/9"?48:34,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)",zIndex:2}}>
                    <div style={{width:0,height:0,borderLeft:`${v.aspect==="16/9"?12:9}px solid rgba(255,255,255,0.7)`,borderTop:`${v.aspect==="16/9"?7:5}px solid transparent`,borderBottom:`${v.aspect==="16/9"?7:5}px solid transparent`,marginLeft:2}}/>
                  </div>
                  <div style={{position:"absolute",top:mob?8:12,left:mob?8:12,zIndex:3,padding:mob?"2px 6px":"4px 10px",fontSize:mob?7:9,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.85)",fontFamily:M,borderRadius:3,backdropFilter:"blur(8px)",background:"linear-gradient(135deg,rgba(120,80,200,0.5),rgba(80,120,220,0.4))"}}>✦ {v.technique}</div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:v.aspect==="16/9"?"50%":"35%",background:"linear-gradient(transparent,rgba(0,0,0,0.8))",zIndex:2}}/>
                  <div style={{position:"absolute",bottom:mob?10:14,left:mob?10:14,right:mob?10:14,zIndex:3}}>
                    <div style={{fontSize:mob?(v.aspect==="16/9"?14:11):(v.aspect==="16/9"?18:14),fontWeight:400,color:"#fff",marginBottom:2}}>{v.title}</div>
                    <div style={{fontSize:mob?8:10,color:"rgba(255,255,255,0.4)",fontFamily:M,letterSpacing:"0.1em",textTransform:"uppercase"}}>{v.client}</div>
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>

    {/* Services */}
    <section style={{padding:`${mob?60:120}px ${px}px`}}>
      <Reveal><Lbl>What We Do</Lbl></Reveal>
      <Reveal delay={0.1}><h2 style={{fontSize:mob?"clamp(24px,8vw,36px)":"clamp(32px,5vw,60px)",fontWeight:200,letterSpacing:"-0.03em",margin:`8px 0 ${mob?30:60}px`}}>Services</h2></Reveal>
      <div>
        {services.map((s,i)=>(
          <Fade key={s.id} delay={i*0.06}>
            <div style={{display:mob?"flex":"grid",flexDirection:"column",gridTemplateColumns:"60px 1fr 1fr",gap:mob?8:40,padding:mob?"24px 0":"36px 0",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
              <span style={{fontFamily:M,fontSize:12,color:"rgba(255,255,255,0.2)"}}>{s.num}</span>
              <h3 style={{fontSize:mob?18:24,fontWeight:300,margin:0,letterSpacing:"-0.02em"}}>{s.title}{s.tag&&<span style={{marginLeft:10,fontSize:10,padding:"2px 8px",background:s.tag==="NEW"?"linear-gradient(135deg,rgba(120,80,200,0.3),rgba(80,120,220,0.2))":"rgba(255,255,255,0.06)",borderRadius:3,verticalAlign:"middle",letterSpacing:"0.1em",fontFamily:M}}>{s.tag}</span>}</h3>
              <p style={{fontSize:mob?13:14,fontWeight:300,color:"rgba(255,255,255,0.4)",margin:0,lineHeight:1.7}}>{s.desc}</p>
            </div>
          </Fade>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section style={{padding:`${mob?80:160}px ${px}px`,textAlign:"center"}}>
      <Reveal style={{display:"flex",justifyContent:"center"}}><Lbl>Start a Project</Lbl></Reveal>
      <Reveal delay={0.15} style={{display:"flex",justifyContent:"center"}}>
        <h2 style={{fontSize:mob?"clamp(28px,9vw,44px)":"clamp(36px,7vw,100px)",fontWeight:200,letterSpacing:"-0.04em",margin:"16px 0 36px",lineHeight:1.05}}>Let's create something<br/><span style={{background:"linear-gradient(135deg,#D4A574,#7BA3C9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>extraordinary.</span></h2>
      </Reveal>
      <Fade delay={0.3} style={{display:"flex",justifyContent:"center"}}>
        <Mag onClick={()=>navigate("/contact")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",padding:mob?"14px 36px":"18px 50px",fontSize:mob?11:12,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:F,borderRadius:0}}>Get in Touch</Mag>
      </Fade>
    </section>
  </>);
};

// ═══ PAGE: PROJECT ═══
const ProjectPage = ({ projects, projectId }) => {
  const mob=useMobile(); const px=mob?20:60;
  const idx=projects.findIndex(p=>p.id===projectId); const project=projects[idx];
  if(!project) return <div style={{padding:"200px 20px",textAlign:"center"}}><h2 style={{fontWeight:200,fontSize:24}}>Project not found</h2><Mag onClick={()=>navigate("/")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",padding:"12px 30px",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:F,borderRadius:0,marginTop:30}}>Back to Home</Mag></div>;
  const prev=idx>0?projects[idx-1]:null; const next=idx<projects.length-1?projects[idx+1]:null;

  return (
    <div style={{paddingTop:mob?80:100}}>
      <div style={{padding:`0 ${px}px`,marginBottom:mob?30:50}}>
        <Fade><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <a onClick={()=>navigate("/")} style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:M,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",textDecoration:"none"}}>← Back</a>
          <span style={{color:"rgba(255,255,255,0.1)"}}>/</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.2)",fontFamily:M,letterSpacing:"0.1em",textTransform:"uppercase"}}>{project.category}</span>
        </div></Fade>
        <Reveal><h1 style={{fontSize:mob?"clamp(28px,9vw,44px)":"clamp(40px,7vw,90px)",fontWeight:200,letterSpacing:"-0.04em",margin:"0 0 8px",lineHeight:1}}>{project.title}</h1></Reveal>
        <Reveal delay={0.1}><p style={{fontSize:mob?15:18,fontWeight:300,color:"rgba(255,255,255,0.35)",margin:0}}>{project.location} — {project.year}</p></Reveal>
      </div>
      <Fade delay={0.2} style={{padding:`0 ${px}px`}}><VideoEmbed videoId={vid(project)} platform={pl(project)} aspect="16/9" style={{borderRadius:mob?4:6}} /></Fade>
      <div style={{padding:`${mob?30:60}px ${px}px 0`,display:mob?"flex":"grid",flexDirection:"column",gridTemplateColumns:"2fr 1fr",gap:mob?30:80,maxWidth:1200}}>
        <Fade delay={0.3}><div><Lbl>About the Project</Lbl><p style={{fontSize:mob?15:17,fontWeight:300,color:"rgba(255,255,255,0.5)",lineHeight:1.9,margin:"12px 0 0"}}>{project.description}</p></div></Fade>
        <Fade delay={0.4}><div style={{display:"flex",flexDirection:mob?"row":"column",gap:mob?20:28,flexWrap:"wrap"}}>
          {[{l:"Duration",v:project.duration},{l:"Format",v:project.format},{l:"Deliverables",v:project.deliverables}].map(({l,v})=>(
            <div key={l} style={{flex:mob?"1 1 auto":"none"}}><div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:4}}>{l}</div><div style={{fontSize:mob?13:15,color:"rgba(255,255,255,0.6)",fontWeight:300}}>{v}</div></div>
          ))}
        </div></Fade>
      </div>
      <div style={{padding:`${mob?40:80}px ${px}px ${mob?20:40}px`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:mob?16:30,borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:mob?40:80}}>
        {prev?<div onClick={()=>navigate(`/project/${prev.id}`)} style={{cursor:"pointer",padding:mob?"16px 0":"30px 0"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:M,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>← Prev</div><div style={{fontSize:mob?16:28,fontWeight:200,color:"rgba(255,255,255,0.6)"}}>{prev.title}</div></div>:<div/>}
        {next?<div onClick={()=>navigate(`/project/${next.id}`)} style={{cursor:"pointer",padding:mob?"16px 0":"30px 0",textAlign:"right"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:M,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Next →</div><div style={{fontSize:mob?16:28,fontWeight:200,color:"rgba(255,255,255,0.6)"}}>{next.title}</div></div>:<div/>}
      </div>
    </div>
  );
};

// ═══ PAGE: ABOUT ═══
const AboutPage = ({config,team}) => {
  const mob=useMobile();const px=mob?20:60;
  return (
    <div style={{paddingTop:mob?80:120}}>
      <section style={{padding:`${mob?40:60}px ${px}px ${mob?50:100}px`}}>
        <Reveal><Lbl>About Path 11</Lbl></Reveal>
        <Reveal delay={0.1}><h1 style={{fontSize:mob?"clamp(28px,9vw,40px)":"clamp(40px,7vw,90px)",fontWeight:200,letterSpacing:"-0.04em",margin:"12px 0 0",lineHeight:1}}>Cinema craft meets<br/><span style={{color:"rgba(255,255,255,0.3)"}}>cutting-edge technology.</span></h1></Reveal>
      </section>
      <section style={{padding:`0 ${px}px ${mob?50:100}px`}}>
        <div style={{display:mob?"flex":"grid",flexDirection:"column",gridTemplateColumns:"1fr 1.2fr",gap:mob?24:80,maxWidth:1200}}>
          <Fade><Lbl>Philosophy</Lbl><h2 style={{fontSize:mob?22:34,fontWeight:200,letterSpacing:"-0.03em",margin:"12px 0 0",lineHeight:1.3}}>Every frame is an<br/><span style={{color:"rgba(255,255,255,0.35)"}}>invitation to feel.</span></h2></Fade>
          <Fade delay={0.15}><p style={{fontSize:mob?14:16,fontWeight:300,color:"rgba(255,255,255,0.45)",lineHeight:1.9,margin:"0 0 20px"}}>{config.philosophy}</p><p style={{fontSize:mob?14:16,fontWeight:300,color:"rgba(255,255,255,0.45)",lineHeight:1.9,margin:0}}>{config.aboutLine1}</p></Fade>
        </div>
      </section>
      <section style={{display:"flex",justifyContent:"center",gap:mob?"clamp(20px,6vw,36px)":"clamp(40px,8vw,120px)",padding:mob?"40px 20px":"60px 40px",borderTop:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)",flexWrap:"wrap"}}>
        {[{n:47,s:"",l:"Projects"},{n:12,s:"",l:"Countries"},{n:6,s:"",l:"Team"},{n:100,s:"%",l:"Referral Rate"}].map(({n,s,l})=>(
          <div key={l} style={{textAlign:"center"}}><div style={{fontSize:mob?24:40,fontWeight:200}}><Count end={n} suffix={s}/></div><div style={{fontSize:mob?8:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",fontFamily:M,marginTop:6}}>{l}</div></div>
        ))}
      </section>
      <section style={{padding:`${mob?50:100}px ${px}px`}}>
        <Reveal><Lbl>The Team</Lbl></Reveal>
        <Reveal delay={0.1}><h2 style={{fontSize:mob?26:48,fontWeight:200,letterSpacing:"-0.03em",margin:`12px 0 ${mob?30:60}px`}}>The people behind<br/><span style={{color:"rgba(255,255,255,0.3)"}}>the lens.</span></h2></Reveal>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(250px,1fr))",gap:mob?20:30}}>
          {team.map((t,i)=>(
            <Fade key={t.id} delay={i*0.08}>
              <div style={{padding:"24px 0",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,rgba(212,165,116,0.15),rgba(123,163,201,0.1))",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:200,color:"rgba(255,255,255,0.3)"}}>{t.name.split(" ").map(n=>n[0]).join("")}</span></div>
                <h3 style={{fontSize:16,fontWeight:400,margin:"0 0 4px"}}>{t.name}</h3>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:M,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>{t.role}</div>
                <p style={{fontSize:13,fontWeight:300,color:"rgba(255,255,255,0.4)",lineHeight:1.7,margin:0}}>{t.bio}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>
      <section style={{padding:`${mob?50:80}px ${px}px ${mob?60:120}px`,textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
        <Reveal style={{display:"flex",justifyContent:"center"}}><h2 style={{fontSize:mob?24:48,fontWeight:200,margin:0}}>Ready to work together?</h2></Reveal>
        <Fade delay={0.15} style={{display:"flex",justifyContent:"center",marginTop:24}}>
          <Mag onClick={()=>navigate("/contact")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",padding:mob?"14px 36px":"16px 44px",fontSize:12,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:F,borderRadius:0}}>Get in Touch</Mag>
        </Fade>
      </section>
    </div>
  );
};

// ═══ PAGE: CONTACT ═══
const ContactPage = ({config}) => {
  const mob=useMobile();const px=mob?20:60;
  const[form,setForm]=useState({name:"",email:"",company:"",budget:"",message:""});
  const[sent,setSent]=useState(false);
  const u=(k,v)=>setForm({...form,[k]:v});
  const inp={width:"100%",padding:"14px 0",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",color:"#fff",fontFamily:F,fontSize:mob?14:15,fontWeight:300,outline:"none",transition:"border-color .3s",boxSizing:"border-box"};

  return (
    <div style={{paddingTop:mob?80:120}}>
      <section style={{padding:`${mob?40:60}px ${px}px ${mob?60:120}px`}}>
        <div style={{display:mob?"flex":"grid",flexDirection:"column",gridTemplateColumns:"1fr 1fr",gap:mob?40:120,maxWidth:1200}}>
          <div>
            <Reveal><Lbl>Contact</Lbl></Reveal>
            <Reveal delay={0.1}><h1 style={{fontSize:mob?"clamp(28px,9vw,40px)":"clamp(36px,5vw,64px)",fontWeight:200,letterSpacing:"-0.04em",margin:"12px 0 24px",lineHeight:1.05}}>Let's start<br/><span style={{color:"rgba(255,255,255,0.3)"}}>a conversation.</span></h1></Reveal>
            <Fade delay={0.2}><p style={{fontSize:mob?13:15,fontWeight:300,color:"rgba(255,255,255,0.4)",lineHeight:1.8,margin:"0 0 36px"}}>{config.contactIntro}</p></Fade>
            <Fade delay={0.3}><div style={{marginBottom:30}}><div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:8}}>Email</div><div style={{fontSize:mob?15:18,fontWeight:300,color:"rgba(255,255,255,0.7)"}}>{config.contactEmail}</div></div></Fade>
            <Fade delay={0.35}><div style={{marginBottom:30}}><div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:8}}>Phone</div><div style={{fontSize:mob?15:18,fontWeight:300,color:"rgba(255,255,255,0.7)"}}>{config.officePhone}</div></div></Fade>
            <Fade delay={0.4}><div><div style={{fontFamily:M,fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:8}}>Studio</div><div style={{fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.5)",lineHeight:1.7,whiteSpace:"pre-line"}}>{config.officeAddress}</div></div></Fade>
          </div>
          <div>
            {sent?(
              <Fade><div style={{padding:mob?"40px 0":"80px 0",textAlign:"center"}}>
                <div style={{width:56,height:56,borderRadius:"50%",border:"1.5px solid rgba(74,222,128,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <h3 style={{fontSize:20,fontWeight:200,marginBottom:8}}>Message Sent</h3>
                <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,fontWeight:300}}>We'll be in touch within 24 hours.</p>
              </div></Fade>
            ):(
              <Fade delay={0.2}><div style={{paddingTop:mob?0:40}}>
                {[{p:"Your Name",k:"name",t:"text"},{p:"Email Address",k:"email",t:"email"},{p:"Company / Property",k:"company",t:"text"}].map(({p:ph,k,t})=>(
                  <div key={k} style={{marginBottom:24}}><input placeholder={ph} type={t} value={form[k]} onChange={e=>u(k,e.target.value)} style={inp} onFocus={e=>e.target.style.borderBottomColor="rgba(255,255,255,0.4)"} onBlur={e=>e.target.style.borderBottomColor="rgba(255,255,255,0.1)"}/></div>
                ))}
                <div style={{marginBottom:24}}><select value={form.budget} onChange={e=>u("budget",e.target.value)} style={{...inp,color:form.budget?"#fff":"rgba(255,255,255,0.3)",cursor:"pointer",appearance:"none"}}><option value="" disabled>Project Budget</option><option value="<25k">Under £25,000</option><option value="25-50k">£25,000 – £50,000</option><option value="50-100k">£50,000 – £100,000</option><option value="100k+">£100,000+</option></select></div>
                <div style={{marginBottom:30}}><textarea placeholder="Tell us about your project..." value={form.message} onChange={e=>u("message",e.target.value)} rows={4} style={{...inp,resize:"vertical",lineHeight:1.7}} onFocus={e=>e.target.style.borderBottomColor="rgba(255,255,255,0.4)"} onBlur={e=>e.target.style.borderBottomColor="rgba(255,255,255,0.1)"}/></div>
                <Mag onClick={()=>setSent(true)} style={{background:"#fff",border:"none",color:"#060606",padding:"14px 36px",fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:F,borderRadius:0,fontWeight:500,width:"100%"}}>Send Enquiry</Mag>
              </div></Fade>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// ═══ MODAL ═══
const VidModal = ({item,onClose,aspect="9/16",extra}) => {
  const mob=useMobile();
  if(!item) return null; const isW=aspect==="16/9";
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.95)",backdropFilter:"blur(30px)",animation:"fadeIn .3s ease",padding:mob?16:0}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:isW?(mob?"95vw":"min(820px,90vw)"):(mob?"85vw":"min(380px,85vw)")}}>
        <button onClick={onClose} style={{position:"absolute",top:mob?-32:-40,right:0,background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:18,cursor:"pointer",padding:8}}>✕</button>
        <VideoEmbed videoId={vid(item)} platform={pl(item)} aspect={aspect} style={{borderRadius:mob?4:8}} />
        <div style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div><div style={{fontSize:mob?14:isW?20:16,fontWeight:400,color:"#fff"}}>{item.title}</div><div style={{fontSize:mob?9:11,color:"rgba(255,255,255,0.4)",fontFamily:M,marginTop:4,letterSpacing:"0.1em",textTransform:"uppercase"}}>{item.client}</div></div>
          {extra}
        </div>
      </div>
    </div>
  );
};

// ═══ PIN ═══
const PinScreen = ({pin:correctPin,onOk,onCancel}) => {
  const[p,setP]=useState("");const[err,setErr]=useState(false);const[shake,setShake]=useState(false);
  const tryPin=next=>{if(next.length===4){setTimeout(()=>{if(next===correctPin)onOk();else{setErr(true);setShake(true);setP("");setTimeout(()=>setShake(false),500);setTimeout(()=>setErr(false),2000)}},150)}};
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.95)",backdropFilter:"blur(30px)",cursor:"auto"}}>
      <div style={{width:300,padding:32,textAlign:"center",animation:shake?"pinShake .4s ease":"fadeIn .3s ease"}}>
        <div style={{width:44,height:44,margin:"0 auto 20px",borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
        <div style={{fontSize:13,fontWeight:300,color:"rgba(255,255,255,0.6)",marginBottom:24}}>Enter PIN</div>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:20}}>
          {[0,1,2,3].map(i=><div key={i} style={{width:13,height:13,borderRadius:"50%",border:err?"1.5px solid rgba(239,68,68,0.5)":"1.5px solid rgba(255,255,255,0.15)",background:i<p.length?(err?"rgba(239,68,68,0.6)":"rgba(255,255,255,0.8)"):"transparent",transition:"all .2s"}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,maxWidth:220,margin:"0 auto"}}>
          {[1,2,3,4,5,6,7,8,9,null,0,"←"].map((n,i)=>n===null?<div key={i}/>:(
            <button key={i} onClick={()=>{if(n==="←"){setP(p.slice(0,-1));setErr(false)}else if(p.length<4){const next=p+n;setP(next);setErr(false);tryPin(next)}}} style={{width:"100%",aspectRatio:"1.4",border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",color:"#fff",fontSize:n==="←"?16:20,fontWeight:300,fontFamily:F,borderRadius:8,cursor:"pointer"}}>{n}</button>
          ))}
        </div>
        {err&&<div style={{fontSize:12,color:"rgba(239,68,68,0.7)",marginTop:14}}>Incorrect PIN</div>}
        <button onClick={onCancel} style={{marginTop:16,background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:11,cursor:"pointer",fontFamily:M}}>Cancel</button>
      </div>
    </div>
  );
};

// ═══ CMS (unchanged, desktop-only tool) ═══
const cI={width:"100%",padding:"8px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",fontFamily:F,fontSize:13,borderRadius:4,outline:"none",boxSizing:"border-box"};
const cL={fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",fontFamily:M,marginBottom:4,display:"block"};
const CF=({l,v,onChange,type="text",options})=>(<div style={{marginBottom:12}}><label style={cL}>{l}</label>{type==="select"?<select value={v} onChange={e=>onChange(e.target.value)} style={cI}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>:type==="textarea"?<textarea value={v} onChange={e=>onChange(e.target.value)} rows={3} style={{...cI,resize:"vertical"}}/>:<input type={type} value={v} onChange={e=>onChange(e.target.value)} style={cI}/>}</div>);
const PF=({platform,onChange})=><CF l="Platform" v={platform||"vimeo"} onChange={onChange} type="select" options={["vimeo","youtube"]}/>;

const CMS = ({open,onClose,config,setConfig,projects,setProjects,reels,setReels,aiVideos,setAiVideos,services,setServices,team,setTeam,onSave,saving}) => {
  const[tab,setTab]=useState("general");const tabs=["general","projects","reels","ai","services","team","contact"];
  const upd=(a,sA,id,f,v)=>sA(a.map(i=>i.id===id?{...i,[f]:v}:i));const rm=(a,sA,id)=>sA(a.filter(i=>i.id!==id));
  const btn={padding:"6px 14px",fontSize:11,fontFamily:F,border:"none",borderRadius:4,cursor:"pointer"};
  if(!open)return null;
  return(
    <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(460px,92vw)",zIndex:300,background:"#111",borderLeft:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",cursor:"auto"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80"}}/><span style={{fontSize:14,fontWeight:500}}>CMS</span></div>
        <div style={{display:"flex",gap:8}}><button onClick={onSave} style={{...btn,background:saving?"rgba(74,222,128,0.15)":"rgba(74,222,128,0.2)",color:"#4ade80"}}>{saving?"Saving...":"Save All"}</button><button onClick={onClose} style={{...btn,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)"}}>✕</button></div>
      </div>
      <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0,overflowX:"auto"}}>
        {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 14px",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:F,border:"none",cursor:"pointer",background:tab===t?"rgba(255,255,255,0.06)":"transparent",color:tab===t?"#fff":"rgba(255,255,255,0.35)",borderBottom:tab===t?"2px solid #fff":"2px solid transparent",whiteSpace:"nowrap"}}>{t}</button>)}
      </div>
      <div style={{flex:1,overflow:"auto",padding:24,scrollbarWidth:"thin"}}>
        {tab==="general"&&<div><CF l="Hero Video ID" v={config.heroVideoId} onChange={v=>setConfig({...config,heroVideoId:v})}/><CF l="Hero Platform" v={config.heroPlatform||"vimeo"} onChange={v=>setConfig({...config,heroPlatform:v})} type="select" options={["vimeo","youtube"]}/><CF l="Philosophy" v={config.philosophy} onChange={v=>setConfig({...config,philosophy:v})} type="textarea"/><CF l="About P1" v={config.aboutLine1} onChange={v=>setConfig({...config,aboutLine1:v})} type="textarea"/><CF l="About P2" v={config.aboutLine2} onChange={v=>setConfig({...config,aboutLine2:v})} type="textarea"/><CF l="Admin PIN" v={config.adminPin} onChange={v=>setConfig({...config,adminPin:v.replace(/\D/g,"").slice(0,4)})}/></div>}
        {tab==="contact"&&<div><CF l="Email" v={config.contactEmail} onChange={v=>setConfig({...config,contactEmail:v})}/><CF l="Phone" v={config.officePhone} onChange={v=>setConfig({...config,officePhone:v})}/><CF l="Address" v={config.officeAddress} onChange={v=>setConfig({...config,officeAddress:v})} type="textarea"/><CF l="Contact Intro" v={config.contactIntro} onChange={v=>setConfig({...config,contactIntro:v})} type="textarea"/></div>}
        {tab==="projects"&&<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Projects ({projects.length})</span><button onClick={()=>setProjects([...projects,{id:`p${Date.now()}`,title:"New Project",location:"",category:"",year:new Date().getFullYear().toString(),color:"#D4A574",videoId:"",platform:"vimeo",description:"",duration:"",format:"",deliverables:""}])} style={{...btn,background:"rgba(255,255,255,0.08)",color:"#fff"}}>+ Add</button></div>
          {projects.map((p,i)=><div key={p.id} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:6,marginBottom:12,border:"1px solid rgba(255,255,255,0.05)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:M}}>#{i+1}</span><button onClick={()=>rm(projects,setProjects,p.id)} style={{...btn,background:"rgba(239,68,68,0.15)",color:"#ef4444",fontSize:10}}>Remove</button></div><CF l="Title" v={p.title} onChange={v=>upd(projects,setProjects,p.id,"title",v)}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><CF l="Location" v={p.location} onChange={v=>upd(projects,setProjects,p.id,"location",v)}/><CF l="Year" v={p.year} onChange={v=>upd(projects,setProjects,p.id,"year",v)}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><CF l="Category" v={p.category} onChange={v=>upd(projects,setProjects,p.id,"category",v)}/><CF l="Color" v={p.color} onChange={v=>upd(projects,setProjects,p.id,"color",v)} type="color"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><CF l="Video ID" v={vid(p)} onChange={v=>upd(projects,setProjects,p.id,"videoId",v)}/><PF platform={pl(p)} onChange={v=>upd(projects,setProjects,p.id,"platform",v)}/></div><CF l="Description" v={p.description} onChange={v=>upd(projects,setProjects,p.id,"description",v)} type="textarea"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><CF l="Duration" v={p.duration} onChange={v=>upd(projects,setProjects,p.id,"duration",v)}/><CF l="Format" v={p.format} onChange={v=>upd(projects,setProjects,p.id,"format",v)}/><CF l="Deliverables" v={p.deliverables} onChange={v=>upd(projects,setProjects,p.id,"deliverables",v)}/></div></div>)}</div>}
        {tab==="reels"&&<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Reels ({reels.length})</span><button onClick={()=>setReels([...reels,{id:`r${Date.now()}`,title:"New Reel",client:"",videoId:"",platform:"vimeo"}])} style={{...btn,background:"rgba(255,255,255,0.08)",color:"#fff"}}>+ Add</button></div>
          {reels.map((r,i)=><div key={r.id} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:6,marginBottom:12,border:"1px solid rgba(255,255,255,0.05)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:M}}>#{i+1}</span><button onClick={()=>rm(reels,setReels,r.id)} style={{...btn,background:"rgba(239,68,68,0.15)",color:"#ef4444",fontSize:10}}>Remove</button></div><CF l="Title" v={r.title} onChange={v=>upd(reels,setReels,r.id,"title",v)}/><CF l="Client" v={r.client} onChange={v=>upd(reels,setReels,r.id,"client",v)}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><CF l="Video ID" v={vid(r)} onChange={v=>upd(reels,setReels,r.id,"videoId",v)}/><PF platform={pl(r)} onChange={v=>upd(reels,setReels,r.id,"platform",v)}/></div></div>)}</div>}
        {tab==="ai"&&<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>AI ({aiVideos.length})</span><button onClick={()=>setAiVideos([...aiVideos,{id:`a${Date.now()}`,title:"New",client:"",videoId:"",platform:"vimeo",technique:"Generative AI",aspect:"16/9"}])} style={{...btn,background:"rgba(255,255,255,0.08)",color:"#fff"}}>+ Add</button></div>
          {aiVideos.map((a,i)=><div key={a.id} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:6,marginBottom:12,border:"1px solid rgba(120,80,200,0.1)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,color:"rgba(160,130,220,0.5)",fontFamily:M}}>#{i+1}</span><button onClick={()=>rm(aiVideos,setAiVideos,a.id)} style={{...btn,background:"rgba(239,68,68,0.15)",color:"#ef4444",fontSize:10}}>Remove</button></div><CF l="Title" v={a.title} onChange={v=>upd(aiVideos,setAiVideos,a.id,"title",v)}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><CF l="Client" v={a.client} onChange={v=>upd(aiVideos,setAiVideos,a.id,"client",v)}/><CF l="Technique" v={a.technique} onChange={v=>upd(aiVideos,setAiVideos,a.id,"technique",v)}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><CF l="Video ID" v={vid(a)} onChange={v=>upd(aiVideos,setAiVideos,a.id,"videoId",v)}/><PF platform={pl(a)} onChange={v=>upd(aiVideos,setAiVideos,a.id,"platform",v)}/></div><CF l="Aspect" v={a.aspect} onChange={v=>upd(aiVideos,setAiVideos,a.id,"aspect",v)} type="select" options={["16/9","9/16"]}/></div>)}</div>}
        {tab==="services"&&<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Services ({services.length})</span><button onClick={()=>setServices([...services,{id:`s${Date.now()}`,num:String(services.length+1).padStart(2,"0"),title:"New",desc:"",tag:""}])} style={{...btn,background:"rgba(255,255,255,0.08)",color:"#fff"}}>+ Add</button></div>
          {services.map((s,i)=><div key={s.id} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:6,marginBottom:12,border:"1px solid rgba(255,255,255,0.05)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:M}}>{s.num}</span><button onClick={()=>rm(services,setServices,s.id)} style={{...btn,background:"rgba(239,68,68,0.15)",color:"#ef4444",fontSize:10}}>Remove</button></div><CF l="Title" v={s.title} onChange={v=>upd(services,setServices,s.id,"title",v)}/><CF l="Description" v={s.desc} onChange={v=>upd(services,setServices,s.id,"desc",v)} type="textarea"/><CF l="Tag" v={s.tag} onChange={v=>upd(services,setServices,s.id,"tag",v)}/></div>)}</div>}
        {tab==="team"&&<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Team ({team.length})</span><button onClick={()=>setTeam([...team,{id:`t${Date.now()}`,name:"New Member",role:"",bio:""}])} style={{...btn,background:"rgba(255,255,255,0.08)",color:"#fff"}}>+ Add</button></div>
          {team.map((t,i)=><div key={t.id} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:6,marginBottom:12,border:"1px solid rgba(255,255,255,0.05)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:M}}>#{i+1}</span><button onClick={()=>rm(team,setTeam,t.id)} style={{...btn,background:"rgba(239,68,68,0.15)",color:"#ef4444",fontSize:10}}>Remove</button></div><CF l="Name" v={t.name} onChange={v=>upd(team,setTeam,t.id,"name",v)}/><CF l="Role" v={t.role} onChange={v=>upd(team,setTeam,t.id,"role",v)}/><CF l="Bio" v={t.bio} onChange={v=>upd(team,setTeam,t.id,"bio",v)} type="textarea"/></div>)}</div>}
      </div>
    </div>
  );
};

// ═══ MAIN ═══
export default function App() {
  const isTouch=useIsTouch();
  const[route,setRoute]=useState(getRoute());const[scrollY,setScrollY]=useState(0);
  const[selReel,setSelReel]=useState(null);const[selAI,setSelAI]=useState(null);
  const[isAdmin,setIsAdmin]=useState(false);const[showPin,setShowPin]=useState(false);
  const[authed,setAuthed]=useState(false);const[cmsOpen,setCmsOpen]=useState(false);const[saving,setSaving]=useState(false);
  const[config,setConfig]=useState(DEF_CONFIG);const[projects,setProjects]=useState(DEF_PROJECTS);
  const[reels,setReels]=useState(DEF_REELS);const[aiVideos,setAiVideos]=useState(DEF_AI);
  const[services,setServices]=useState(DEF_SERVICES);const[team,setTeam]=useState(DEF_TEAM);

  useEffect(()=>{const h=()=>setRoute(getRoute());window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);
  useEffect(()=>{try{const p=new URLSearchParams(window.location.search);setIsAdmin(p.get("admin")==="true")}catch{try{setIsAdmin(window.location.hash.includes("admin=true"))}catch{}};},[]);
  useEffect(()=>{(async()=>{const[c,p,r,a,s,t]=await Promise.all([db.load("p11:config",DEF_CONFIG),db.load("p11:projects",DEF_PROJECTS),db.load("p11:reels",DEF_REELS),db.load("p11:ai",DEF_AI),db.load("p11:services",DEF_SERVICES),db.load("p11:team",DEF_TEAM)]);setConfig(c);setProjects(p);setReels(r);setAiVideos(a);setServices(s);setTeam(t)})()},[]);
  useEffect(()=>{const h=()=>setScrollY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);

  const save=async()=>{setSaving(true);await Promise.all([db.save("p11:config",config),db.save("p11:projects",projects),db.save("p11:reels",reels),db.save("p11:ai",aiVideos),db.save("p11:services",services),db.save("p11:team",team)]);setTimeout(()=>setSaving(false),800)};
  const goHome=()=>{navigate("/");window.scrollTo(0,0)};
  let page="home",pageArg=null;
  if(route.startsWith("/project/")){page="project";pageArg=route.split("/project/")[1]}
  else if(route==="/about")page="about";else if(route==="/contact")page="contact";

  return (
    <div style={{background:"#060606",color:"#fff",fontFamily:F,cursor:(cmsOpen||showPin||isTouch)?"auto":"none",minHeight:"100vh",overflowX:"hidden"}}>
      {!cmsOpen&&!showPin&&<Cursor/>}
      <style>{`@keyframes scrollLine{0%{transform:translateY(-100%)}50%{transform:translateY(250%)}100%{transform:translateY(-100%)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes pinShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-12px)}40%{transform:translateX(10px)}60%{transform:translateX(-8px)}80%{transform:translateX(6px)}} html{scroll-behavior:smooth}`}</style>

      {isAdmin&&<button onClick={()=>{if(authed)setCmsOpen(!cmsOpen);else setShowPin(true)}} style={{position:"fixed",bottom:24,right:24,zIndex:250,width:44,height:44,borderRadius:"50%",background:cmsOpen?"#4ade80":"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",color:cmsOpen?"#000":"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",transition:"all .3s"}}>{cmsOpen?"✕":"✎"}</button>}
      {showPin&&<PinScreen pin={config.adminPin} onOk={()=>{setAuthed(true);setShowPin(false);setCmsOpen(true)}} onCancel={()=>setShowPin(false)}/>}
      <CMS open={cmsOpen} onClose={()=>setCmsOpen(false)} config={config} setConfig={setConfig} projects={projects} setProjects={setProjects} reels={reels} setReels={setReels} aiVideos={aiVideos} setAiVideos={setAiVideos} services={services} setServices={setServices} team={team} setTeam={setTeam} onSave={save} saving={saving}/>
      <Nav scrollY={scrollY} cmsOpen={cmsOpen} onHome={goHome}/>

      {page==="home"&&<HomePage config={config} projects={projects} reels={reels} aiVideos={aiVideos} services={services} setSelectedReel={setSelReel} setSelectedAI={setSelAI}/>}
      {page==="project"&&<ProjectPage projects={projects} projectId={pageArg}/>}
      {page==="about"&&<AboutPage config={config} team={team}/>}
      {page==="contact"&&<ContactPage config={config}/>}
      <Footer/>

      <VidModal item={selReel} onClose={()=>setSelReel(null)} aspect="9/16"/>
      <VidModal item={selAI} onClose={()=>setSelAI(null)} aspect={selAI?.aspect||"16/9"} extra={selAI&&<div style={{background:"linear-gradient(135deg,rgba(120,80,200,0.4),rgba(80,120,220,0.3))",padding:"4px 12px",fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.8)",fontFamily:M,borderRadius:3,alignSelf:"center"}}>✦ {selAI.technique}</div>}/>
    </div>
  );
}