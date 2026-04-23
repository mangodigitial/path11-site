'use client';

import { useState, useTransition, useRef, useEffect, type ReactNode } from 'react';
import {
  type HeroTake,
  type HeroTile,
  type Project,
  type Service,
  type TeamMember,
  type Config,
  parseVideoInput,
  vimeoEmbedUrl,
} from '@/lib/content';
import { uploadToMedia, deleteFromMedia } from '@/lib/supabase';
import {
  saveRow,
  deleteRow,
  reorder,
  saveConfig,
  logoutAction,
} from './actions';

// ═══════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════

type Initial = {
  heroTakes: HeroTake[];
  projects: Project[];
  services: Service[];
  team: TeamMember[];
  config: Config;
};

const TABS = [
  { id: 'hero',     label: 'Hero Takes' },
  { id: 'work',     label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'team',     label: 'Team' },
  { id: 'settings', label: 'Settings' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AdminShell({ initial }: { initial: Initial }) {
  const [tab, setTab] = useState<TabId>('hero');

  return (
    <div className="min-h-screen flex" style={{ background: '#0A1316', color: '#F0E8DA', fontFamily: "'Archivo', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-white/5 p-6 flex flex-col">
        <div className="mb-10">
          <a href="/" className="font-black text-[18px] leading-none tracking-[-0.04em] hover:text-[#C9A961] transition-colors">
            P<span className="font-thin">11</span>
          </a>
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/40 mt-2">Admin</div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left px-3 py-2 text-[13px] rounded transition-colors ${
                tab === t.id
                  ? 'bg-white/5 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="block text-[11px] tracking-[0.02em] text-white/50 hover:text-white transition-colors"
          >
            View site ↗
          </a>
          <form action={logoutAction}>
            <button type="submit" className="text-[11px] tracking-[0.02em] text-white/50 hover:text-[#C9A961] transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-8 md:px-12 py-10 max-w-[1200px] overflow-x-hidden">
        {tab === 'hero'     && <HeroTakesEditor initial={initial.heroTakes} />}
        {tab === 'work'     && <ProjectsEditor initial={initial.projects} />}
        {tab === 'services' && <ServicesEditor initial={initial.services} />}
        {tab === 'team'     && <TeamEditor initial={initial.team} />}
        {tab === 'settings' && <SettingsEditor initial={initial.config} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SHARED PRIMITIVES
// ═══════════════════════════════════════════════════════════

function SectionHeader({ title, sub, onNew }: { title: string; sub?: string; onNew?: () => void }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h1 className="text-[24px] font-medium">{title}</h1>
        {sub && <p className="text-[13px] text-white/50 mt-1">{sub}</p>}
      </div>
      {onNew && (
        <button onClick={onNew} className="px-4 py-2 bg-[#C9A961] text-[#0A1316] text-[12px] font-medium hover:opacity-90 transition-opacity">
          + New
        </button>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5 mb-4">
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <label className="block text-[10px] tracking-[0.14em] uppercase text-white/40 mb-1.5">{children}</label>;
}

function Input({ value, onChange, ...rest }: { value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <input
      {...rest}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#06101220] border border-white/10 focus:border-white/30 px-3 py-2 text-[14px] outline-none transition-colors"
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      rows={rows}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#06101220] border border-white/10 focus:border-white/30 px-3 py-2 text-[14px] leading-[1.5] outline-none transition-colors resize-y"
    />
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ArrayField({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} onChange={nv => { const next = [...values]; next[i] = nv; onChange(next); }} placeholder={placeholder} />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="px-3 text-white/40 hover:text-[#C9A961] text-[16px]"
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="text-[12px] text-white/50 hover:text-white transition-colors"
      >
        + Add item
      </button>
    </div>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-white/70">
      <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function SaveButton({ onClick, pending }: { onClick: () => void; pending: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="px-4 py-2 bg-[#F0E8DA] text-[#0A1316] text-[12px] font-medium hover:bg-[#C9A961] transition-colors disabled:opacity-50"
    >
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}

function DeleteButton({ onClick, pending }: { onClick: () => void; pending: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="px-4 py-2 text-[12px] text-white/50 hover:text-[#C9A961] transition-colors disabled:opacity-50"
    >
      Delete
    </button>
  );
}

// ─── Image upload with live preview ─────────────────────────

function ImageUpload({ value, onChange, folder = 'uploads' }: { value: string | null | undefined; onChange: (url: string | null) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const url = await uploadToMedia(file, folder);
      onChange(url);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative border border-white/10 bg-white/[0.02] p-2 flex items-center gap-3">
          <img src={value} alt="" className="w-20 h-20 object-cover" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-white/40 truncate">{value.split('/').pop()}</div>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => inputRef.current?.click()} className="text-[11px] text-white/70 hover:text-white">Replace</button>
              <button type="button" onClick={() => onChange(null)} className="text-[11px] text-white/50 hover:text-[#C9A961]">Remove</button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border border-dashed border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] transition-colors py-6 text-[12px] text-white/50"
        >
          {uploading ? 'Uploading…' : 'Click to upload image'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />
      {error && <div className="text-[11px] text-[#C9A961] mt-1">{error}</div>}
    </div>
  );
}

// ─── Video field — paste URL or Vimeo ID, auto-detect ──────

function VideoInput({
  urlValue,
  typeValue,
  onChange,
}: {
  urlValue: string | null | undefined;
  typeValue: 'vimeo' | 'mp4' | null | undefined;
  onChange: (url: string | null, type: 'vimeo' | 'mp4' | null) => void;
}) {
  const [raw, setRaw] = useState(urlValue || '');

  const handle = (input: string) => {
    setRaw(input);
    if (!input.trim()) {
      onChange(null, null);
      return;
    }
    const parsed = parseVideoInput(input);
    onChange(parsed.url || null, parsed.type);
  };

  return (
    <div>
      <Input
        value={raw}
        onChange={handle}
        placeholder="Vimeo URL, Vimeo ID, or .mp4 link"
      />
      {urlValue && typeValue === 'vimeo' && (
        <div className="mt-2 text-[11px] text-white/40">
          Vimeo ID <span className="text-[#C9A961]">{urlValue}</span> — will render as background embed
        </div>
      )}
      {urlValue && typeValue === 'mp4' && (
        <div className="mt-2 text-[11px] text-white/40">
          Direct video URL — will render as &lt;video&gt;
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HERO TAKES EDITOR
// ═══════════════════════════════════════════════════════════

function HeroTakesEditor({ initial }: { initial: HeroTake[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, start] = useTransition();

  const update = (id: string, patch: Partial<HeroTake>) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const save = (row: HeroTake) => {
    start(async () => {
      await saveRow('hero_takes', {
        id: row.id?.startsWith('new-') ? undefined : row.id,
        order_index: row.order_index,
        tiles: row.tiles,
        published: row.published,
      });
      window.location.reload();
    });
  };

  const remove = (id: string) => {
    if (!confirm('Delete this take?')) return;
    start(async () => {
      await deleteRow('hero_takes', id);
      setRows(rs => rs.filter(r => r.id !== id));
    });
  };

  const addNew = () => {
    const max = rows.reduce((m, r) => Math.max(m, r.order_index), 0);
    setRows([...rows, {
      id: `new-${Date.now()}`,
      order_index: max + 1,
      tiles: [{ label: '', meta: '' }],
      published: true,
    }]);
  };

  return (
    <div>
      <SectionHeader
        title="Hero Takes"
        sub="The hero cycles through these when you click 'Take NN/NN'. On mobile, every tile becomes its own take automatically."
        onNew={addNew}
      />

      {rows.map((row, ri) => (
        <Card key={row.id}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] tracking-[0.22em] uppercase text-white/50">
              Take {String(ri + 1).padStart(2, '0')}
            </div>
            <Toggle label="Published" value={row.published} onChange={v => update(row.id, { published: v })} />
          </div>

          {row.tiles.map((tile, ti) => (
            <div key={ti} className="border-l-2 border-white/10 pl-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] tracking-[0.02em] text-white/40">
                  Tile {ti + 1} of {row.tiles.length}
                </div>
                {row.tiles.length > 1 && (
                  <button
                    onClick={() => update(row.id, { tiles: row.tiles.filter((_, i) => i !== ti) })}
                    className="text-[11px] text-white/40 hover:text-[#C9A961]"
                  >
                    Remove tile
                  </button>
                )}
              </div>

              <Field label="Label (shown in caption)">
                <Input value={tile.label} onChange={v => {
                  const next = [...row.tiles]; next[ti] = { ...tile, label: v };
                  update(row.id, { tiles: next });
                }} />
              </Field>

              <Field label="Meta (below label — e.g. 'Bangkok / Brand Film')">
                <Input value={tile.meta} onChange={v => {
                  const next = [...row.tiles]; next[ti] = { ...tile, meta: v };
                  update(row.id, { tiles: next });
                }} />
              </Field>

              <Field label="Background image (fallback if no video)">
                <ImageUpload value={tile.image_url} folder="hero" onChange={url => {
                  const next = [...row.tiles]; next[ti] = { ...tile, image_url: url };
                  update(row.id, { tiles: next });
                }} />
              </Field>

              <Field label="Video (overrides image)">
                <VideoInput
                  urlValue={tile.video_url}
                  typeValue={tile.video_type}
                  onChange={(url, type) => {
                    const next = [...row.tiles]; next[ti] = { ...tile, video_url: url, video_type: type };
                    update(row.id, { tiles: next });
                  }}
                />
              </Field>
            </div>
          ))}

          {row.tiles.length < 3 && (
            <button
              onClick={() => update(row.id, { tiles: [...row.tiles, { label: '', meta: '' }] })}
              className="text-[12px] text-white/50 hover:text-white mb-4"
            >
              + Add tile to this take
            </button>
          )}

          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
            <SaveButton onClick={() => save(row)} pending={pending} />
            {!row.id?.startsWith('new-') && <DeleteButton onClick={() => remove(row.id)} pending={pending} />}
          </div>
        </Card>
      ))}

      {rows.length === 0 && (
        <div className="text-center py-20 text-white/40 text-[13px]">
          No takes yet. Click &ldquo;+ New&rdquo; to create one.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROJECTS EDITOR
// ═══════════════════════════════════════════════════════════

function ProjectsEditor({ initial }: { initial: Project[] }) {
  const [rows, setRows] = useState<Project[]>(initial);
  const [pending, start] = useTransition();

  const update = (id: string, patch: Partial<Project>) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const save = (row: Project) => {
    start(async () => {
      await saveRow('projects', {
        id: row.id?.startsWith('new-') ? undefined : row.id,
        slug: row.slug,
        order_index: row.order_index,
        title: row.title,
        location: row.location,
        category: row.category,
        year: row.year,
        services: row.services,
        image_url: row.image_url,
        video_url: row.video_url,
        video_type: row.video_type,
        description: row.description,
        size: row.size,
        published: row.published,
      });
      window.location.reload();
    });
  };

  const remove = (id: string) => {
    if (!confirm('Delete this project?')) return;
    start(async () => {
      await deleteRow('projects', id);
      setRows(rs => rs.filter(r => r.id !== id));
    });
  };

  const addNew = () => {
    const max = rows.reduce((m, r) => Math.max(m, r.order_index), 0);
    setRows([...rows, {
      id: `new-${Date.now()}`,
      slug: `project-${Date.now()}`,
      order_index: max + 1,
      title: '',
      location: '',
      category: '',
      year: String(new Date().getFullYear()),
      services: [],
      image_url: null,
      video_url: null,
      video_type: null,
      description: '',
      size: 'wide',
      published: true,
    }]);
  };

  return (
    <div>
      <SectionHeader
        title="Projects"
        sub="Projects shown in the Work grid. The first project appears as the featured row; subsequent ones alternate in an editorial mosaic."
        onNew={addNew}
      />

      {rows.map(row => (
        <Card key={row.id}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] tracking-[0.22em] uppercase text-white/50">{row.slug}</div>
            <Toggle label="Published" value={row.published} onChange={v => update(row.id, { published: v })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title"><Input value={row.title} onChange={v => update(row.id, { title: v })} /></Field>
            <Field label="Slug (URL-safe)"><Input value={row.slug} onChange={v => update(row.id, { slug: v })} /></Field>
            <Field label="Location"><Input value={row.location || ''} onChange={v => update(row.id, { location: v })} /></Field>
            <Field label="Year"><Input value={row.year || ''} onChange={v => update(row.id, { year: v })} /></Field>
            <Field label="Category"><Input value={row.category || ''} onChange={v => update(row.id, { category: v })} /></Field>
            <Field label="Order"><Input type="number" value={String(row.order_index)} onChange={v => update(row.id, { order_index: Number(v) || 0 })} /></Field>
          </div>

          <Field label="Services (tags shown under title)">
            <ArrayField values={row.services} onChange={v => update(row.id, { services: v })} placeholder="e.g. Brand Film" />
          </Field>

          <Field label="Description (optional — used on project detail pages later)">
            <Textarea rows={3} value={row.description || ''} onChange={v => update(row.id, { description: v })} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Thumbnail image">
              <ImageUpload value={row.image_url} folder="projects" onChange={url => update(row.id, { image_url: url })} />
            </Field>
            <Field label="Video (Vimeo or MP4)">
              <VideoInput
                urlValue={row.video_url}
                typeValue={row.video_type}
                onChange={(url, type) => update(row.id, { video_url: url, video_type: type })}
              />
            </Field>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
            <SaveButton onClick={() => save(row)} pending={pending} />
            {!row.id?.startsWith('new-') && <DeleteButton onClick={() => remove(row.id)} pending={pending} />}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SERVICES EDITOR
// ═══════════════════════════════════════════════════════════

function ServicesEditor({ initial }: { initial: Service[] }) {
  const [rows, setRows] = useState<Service[]>(initial);
  const [pending, start] = useTransition();

  const update = (id: string, patch: Partial<Service>) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const save = (row: Service) => {
    start(async () => {
      await saveRow('services', {
        id: row.id?.startsWith('new-') ? undefined : row.id,
        slug: row.slug,
        order_index: row.order_index,
        num: row.num,
        nav: row.nav,
        title: row.title,
        summary: row.summary,
        description: row.description,
        deliverables: row.deliverables,
        thumb_image_url: row.thumb_image_url,
        published: row.published,
      });
      window.location.reload();
    });
  };

  const remove = (id: string) => {
    if (!confirm('Delete this service?')) return;
    start(async () => {
      await deleteRow('services', id);
      setRows(rs => rs.filter(r => r.id !== id));
    });
  };

  const addNew = () => {
    const max = rows.reduce((m, r) => Math.max(m, r.order_index), 0);
    const num = String(max + 1).padStart(2, '0');
    setRows([...rows, {
      id: `new-${Date.now()}`,
      slug: `service-${Date.now()}`,
      order_index: max + 1,
      num,
      nav: '',
      title: '',
      summary: '',
      description: '',
      deliverables: [],
      thumb_image_url: null,
      published: true,
    }]);
  };

  return (
    <div>
      <SectionHeader title="Services" sub="Shown in the contact-sheet grid and in the Services detail section." onNew={addNew} />

      {rows.map(row => (
        <Card key={row.id}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] tracking-[0.22em] uppercase text-white/50">{row.num} / {row.slug}</div>
            <Toggle label="Published" value={row.published} onChange={v => update(row.id, { published: v })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Num (e.g. 01)"><Input value={row.num} onChange={v => update(row.id, { num: v })} /></Field>
            <Field label="Nav label (short)"><Input value={row.nav} onChange={v => update(row.id, { nav: v })} /></Field>
            <Field label="Order"><Input type="number" value={String(row.order_index)} onChange={v => update(row.id, { order_index: Number(v) || 0 })} /></Field>
          </div>

          <Field label="Title (full name)"><Input value={row.title} onChange={v => update(row.id, { title: v })} /></Field>
          <Field label="Slug"><Input value={row.slug} onChange={v => update(row.id, { slug: v })} /></Field>
          <Field label="Summary (one-line strap)"><Input value={row.summary || ''} onChange={v => update(row.id, { summary: v })} /></Field>
          <Field label="Description"><Textarea rows={4} value={row.description || ''} onChange={v => update(row.id, { description: v })} /></Field>
          <Field label="Deliverables"><ArrayField values={row.deliverables} onChange={v => update(row.id, { deliverables: v })} placeholder="e.g. Brand Film" /></Field>
          <Field label="Thumbnail image (shown in contact sheet)">
            <ImageUpload value={row.thumb_image_url} folder="services" onChange={url => update(row.id, { thumb_image_url: url })} />
          </Field>

          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
            <SaveButton onClick={() => save(row)} pending={pending} />
            {!row.id?.startsWith('new-') && <DeleteButton onClick={() => remove(row.id)} pending={pending} />}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEAM EDITOR
// ═══════════════════════════════════════════════════════════

function TeamEditor({ initial }: { initial: TeamMember[] }) {
  const [rows, setRows] = useState<TeamMember[]>(initial);
  const [pending, start] = useTransition();

  const update = (id: string, patch: Partial<TeamMember>) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const save = (row: TeamMember) => {
    start(async () => {
      await saveRow('team', {
        id: row.id?.startsWith('new-') ? undefined : row.id,
        order_index: row.order_index,
        name: row.name,
        role: row.role,
        bio: row.bio,
        photo_url: row.photo_url,
        is_founder: row.is_founder,
        published: row.published,
      });
      window.location.reload();
    });
  };

  const remove = (id: string) => {
    if (!confirm('Delete this team member?')) return;
    start(async () => {
      await deleteRow('team', id);
      setRows(rs => rs.filter(r => r.id !== id));
    });
  };

  const addNew = () => {
    const max = rows.reduce((m, r) => Math.max(m, r.order_index), 0);
    setRows([...rows, {
      id: `new-${Date.now()}`,
      order_index: max + 1,
      name: '',
      role: '',
      bio: '',
      photo_url: null,
      is_founder: false,
      published: true,
    }]);
  };

  return (
    <div>
      <SectionHeader title="Team" sub="Mark one member as founder — their photo and quote are featured. Others appear as department heads in the strip below." onNew={addNew} />

      {rows.map(row => (
        <Card key={row.id}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] tracking-[0.22em] uppercase text-white/50">
              {row.name || 'New member'}{row.is_founder && <span className="text-[#C9A961] ml-2">Founder</span>}
            </div>
            <div className="flex items-center gap-4">
              <Toggle label="Founder" value={row.is_founder} onChange={v => update(row.id, { is_founder: v })} />
              <Toggle label="Published" value={row.published} onChange={v => update(row.id, { published: v })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name"><Input value={row.name} onChange={v => update(row.id, { name: v })} /></Field>
            <Field label="Role"><Input value={row.role} onChange={v => update(row.id, { role: v })} /></Field>
          </div>
          <Field label="Bio"><Textarea rows={3} value={row.bio || ''} onChange={v => update(row.id, { bio: v })} /></Field>
          <Field label="Photo"><ImageUpload value={row.photo_url} folder="team" onChange={url => update(row.id, { photo_url: url })} /></Field>

          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
            <SaveButton onClick={() => save(row)} pending={pending} />
            {!row.id?.startsWith('new-') && <DeleteButton onClick={() => remove(row.id)} pending={pending} />}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SETTINGS EDITOR
// ═══════════════════════════════════════════════════════════

function SettingsEditor({ initial }: { initial: Config }) {
  const [cfg, setCfg] = useState<Config>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    start(async () => {
      await saveConfig({
        tagline: cfg.tagline,
        sub_copy: cfg.sub_copy,
        founder_quote: cfg.founder_quote,
        email: cfg.email,
        studios: cfg.studios,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div>
      <SectionHeader title="Settings" sub="Site-wide copy and contact details." />

      <Card>
        <Field label="Tagline (main headline below hero)">
          <Textarea rows={2} value={cfg.tagline || ''} onChange={v => setCfg({ ...cfg, tagline: v })} />
        </Field>
        <Field label="Sub-copy (secondary paragraph next to tagline)">
          <Textarea rows={4} value={cfg.sub_copy || ''} onChange={v => setCfg({ ...cfg, sub_copy: v })} />
        </Field>
        <Field label="Founder quote (in Studio section)">
          <Textarea rows={4} value={cfg.founder_quote || ''} onChange={v => setCfg({ ...cfg, founder_quote: v })} />
        </Field>
        <Field label="Contact email">
          <Input value={cfg.email} onChange={v => setCfg({ ...cfg, email: v })} />
        </Field>
        <Field label="Studios (cities)">
          <ArrayField values={cfg.studios} onChange={v => setCfg({ ...cfg, studios: v })} placeholder="e.g. London" />
        </Field>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <SaveButton onClick={save} pending={pending} />
          {saved && <span className="text-[12px] text-[#C9A961]">Saved ✓</span>}
        </div>
      </Card>
    </div>
  );
}
