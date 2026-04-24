import { useState, useEffect } from "react";

const GREEN_DARK = "#27500A";
const GREEN_MED = "#3B6D11";
const GREEN_LIGHT = "#EAF3DE";
const AMBER_DARK = "#633806";
const AMBER_MED = "#BA7517";
const AMBER_LIGHT = "#FAEEDA";

const FILTERS = [
  { id: "vegetarien", label: "🥦 Végétarien" },
  { id: "sans_gluten", label: "🌾 Sans gluten" },
  { id: "rapide", label: "⚡ Rapide -20 min" },
  { id: "budget", label: "💰 Budget serré" },
];

async function fetchYoutubeShort(query) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const q = encodeURIComponent(query + " recette short");
  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + q + "&type=video&videoDuration=short&maxResults=1&key=" + apiKey;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: "https://www.youtube.com/shorts/" + item.id.videoId
    };
  } catch {
    return null;
  }
}

function DiffBadge({ d }) {
  const styles = {
    Facile: { bg: "#EAF3DE", color: "#27500A" },
    Moyen: { bg: "#FAEEDA", color: "#633806" },
    Difficile: { bg: "#FCEBEB", color: "#791F1F" },
  };
  const s = styles[d] || styles["Moyen"];
  return <span style={{ fontSize: 11, padding: "2px 9px", background: s.bg, color: s.color, borderRadius: 99, whiteSpace: "nowrap" }}>{d}</span>;
}

function RecipeCard({ recipe, isAddition }) {
  const [video, setVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const accent = isAddition ? AMBER_MED : GREEN_MED;
  const query = encodeURIComponent((recipe.youtube_query || recipe.name) + " recette");
  const ttUrl = "https://www.tiktok.com/search?q=" + query;
  const igUrl = "https://www.instagram.com/explore/tags/" + encodeURIComponent((recipe.youtube_query || recipe.name).replace(/ /g, ""));

  useEffect(() => {
    setLoadingVideo(true);
    fetchYoutubeShort(recipe.youtube_query || recipe.name)
      .then(v => setVideo(v))
      .finally(() => setLoadingVideo(false));
  }, [recipe.name]);

  return (
    <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "1rem 1.25rem", borderLeft: "3px solid " + accent }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, margin: 0 }}>{recipe.name}</h3>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center", paddingTop: 1 }}>
          <DiffBadge d={recipe.difficulty} />
          <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>{recipe.time}</span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.55, marginBottom: 8, marginTop: 0 }}>{recipe.description}</p>

      {recipe.used_ingredients?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#888", marginRight: 2 }}>Utilise :</span>
          {recipe.used_ingredients.map((ing, i) => <span key={i} style={{ fontSize: 12, padding: "2px 8px", background: GREEN_LIGHT, color: GREEN_DARK, borderRadius: 99 }}>{ing}</span>)}
        </div>
      )}

      {isAddition && recipe.additional_ingredients?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#888", marginRight: 2 }}>À ajouter :</span>
          {recipe.additional_ingredients.map((ing, i) => <span key={i} style={{ fontSize: 12, padding: "2px 8px", background: AMBER_LIGHT, color: AMBER_DARK, borderRadius: 99 }}>+ {ing}</span>)}
        </div>
      )}

      {loadingVideo && <p style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Recherche d'un Short YouTube...</p>}

      {video && (
        <a href={video.url} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 10, textDecoration: "none" }}>
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "0.5px solid rgba(0,0,0,0.1)" }}>
            <img src={video.thumbnail} alt={video.title} style={{ width: "100%", display: "block" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 44, height: 44, background: "#FF0000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div style={{ position: "absolute", top: 8, right: 8, background: "#FF0000", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>SHORTS</div>
          </div>
          <p style={{ fontSize: 12, color: "#555", margin: "4px 0 8px", lineHeight: 1.3 }}>{video.title}</p>
        </a>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a href={ttUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#fff", background: "#000", textDecoration: "none", fontWeight: 500, padding: "4px 10px", borderRadius: 99 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.07a8.16 8.16 0 0 0 4.77 1.52V7.15a4.85 4.85 0 0 1-1-.46z"/></svg>
          TikTok
        </a>
        <a href={igUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#fff", background: "#E1306C", textDecoration: "none", fontWeight: 500, padding: "4px 10px", borderRadius: 99 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          Instagram
        </a>
      </div>
    </div>
  );
}

function ShoppingList({ recipes }) {
  const [copied, setCopied] = useState(false);
  const allMissing = [...new Set(recipes.flatMap(r => r.additional_ingredients || []))];
  if (!allMissing.length) return null;

  const listText = "🛒 Ma liste de courses :\n" + allMissing.map(i => "- " + i).join("\n");

  function copyList() {
    navigator.clipboard.writeText(listText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function sendSMS() {
    window.open("sms:?body=" + encodeURIComponent(listText));
  }

  return (
    <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "1.25rem", marginTop: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
        <span style={{ fontSize: 18 }}>🛒</span>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Liste de courses</h2>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {allMissing.map((ing, i) => <span key={i} style={{ fontSize: 13, padding: "4px 10px", background: AMBER_LIGHT, color: AMBER_DARK, borderRadius: 99 }}>+ {ing}</span>)}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={copyList} style={{ flex: 1, padding: "9px 0", background: copied ? GREEN_MED : "#f0f0ed", color: copied ? GREEN_LIGHT : "#333", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {copied ? "✓ Copié !" : "📋 Copier la liste"}
        </button>
        <button onClick={sendSMS} style={{ flex: 1, padding: "9px 0", background: GREEN_DARK, color: GREEN_LIGHT, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          💬 Envoyer par SMS
        </button>
      </div>
    </div>
  );
}

export default function CookingApp() {
  const [ingredients, setIngredients] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  function addIngredient() {
    if (!inputVal.trim()) return;
    const parts = inputVal.split(",").map(s => s.trim()).filter(Boolean);
    setIngredients(prev => {
      const existing = prev.map(i => i.toLowerCase());
      return [...prev, ...parts.filter(p => !existing.includes(p.toLowerCase()))];
    });
    setInputVal("");
  }

  function toggleFilter(id) {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  async function findRecipes() {
    if (!ingredients.length) { setError("Ajoutez au moins un ingrédient !"); return; }
    setError("");
    setResults(null);
    setLoading(true);

    const many = ingredients.length >= 4;
    const filterLabels = activeFilters.map(id => FILTERS.find(f => f.id === id)?.label.replace(/[🥦🌾⚡💰] /g, "")).filter(Boolean);
    const filterNote = filterLabels.length ? "Contraintes obligatoires : " + filterLabels.join(", ") + "." : "";
    const subsetNote = many ? "Propose des recettes avec des SOUS-ENSEMBLES DIFFÉRENTS d'ingrédients." : "";

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": (import.meta.env.VITE_ANTHROPIC_API_KEY || "").trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1400,
          system: "Tu es un chef cuisinier expert. Réponds UNIQUEMENT avec du JSON valide brut, sans markdown, sans backticks. Toujours en français.",
          messages: [{
            role: "user",
            content: "Ingrédients disponibles : " + ingredients.join(", ") + ". " + filterNote + " " + subsetNote + "\n\nRetourne un JSON avec :\n- \"recipes_now\" : " + (many ? 4 : 3) + " recettes faisables. Chaque objet : { \"name\", \"description\" (1 phrase), \"difficulty\": \"Facile\"|\"Moyen\"|\"Difficile\", \"time\", \"youtube_query\", \"used_ingredients\": string[] }\n- \"recipes_with_additions\" : 3 recettes avec 1-3 ingrédients supplémentaires. Chaque objet : { \"name\", \"description\", \"difficulty\", \"time\", \"youtube_query\", \"used_ingredients\": string[], \"additional_ingredients\": string[] }\n\nRespecte absolument les contraintes si indiquées."
          }]
        })
      });

      if (!res.ok) throw new Error("HTTP " + res.status + " — " + await res.text());
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const textBlock = data.content?.find(b => b.type === "text");
      if (!textBlock) throw new Error("Pas de contenu.");
      setResults(JSON.parse(textBlock.text));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 660, margin: "0 auto", padding: "1.5rem 1rem", background: "#fafaf8", color: "#1a1a1a" }}, minHeight: "100vh" }}>

      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>Qu'est-ce qu'on mange ?</h1>
        <p style={{ fontSize: 14, color: "#666", margin: 0 }}>Entrez vos ingrédients — on s'occupe du reste.</p>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && addIngredient()} placeholder="ex: poulet, tomates, ail..." style={{ flex: 1, padding: "8px 12px", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafaf8" }} />
          <button onClick={addIngredient} style={{ padding: "0 16px", background: GREEN_MED, color: GREEN_LIGHT, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", height: 38 }}>+ Ajouter</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 32 }}>
          {ingredients.length === 0
            ? <span style={{ fontSize: 13, color: "#aaa", paddingTop: 6 }}>Aucun ingrédient ajouté...</span>
            : ingredients.map((ing, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#f0f0ed", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 99, fontSize: 13, color: "#333" }}>
                {ing}
                <button onClick={() => setIngredients(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
              </span>
            ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>Filtres :</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => toggleFilter(f.id)} style={{ padding: "6px 12px", background: activeFilters.includes(f.id) ? GREEN_DARK : "#fff", color: activeFilters.includes(f.id) ? GREEN_LIGHT : "#444", border: "0.5px solid " + (activeFilters.includes(f.id) ? GREEN_DARK : "rgba(0,0,0,0.15)"), borderRadius: 99, fontSize: 13, cursor: "pointer", fontWeight: activeFilters.includes(f.id) ? 600 : 400 }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={findRecipes} disabled={loading} style={{ width: "100%", padding: "12px 16px", background: loading ? "#aaa" : GREEN_DARK, color: GREEN_LIGHT, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginBottom: "1.5rem" }}>
        {loading ? "Recherche en cours..." : "Trouver mes recettes ✦"}
      </button>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "#666" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
            {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN_MED, display: "inline-block", animation: "pulse 1.2s ease-in-out " + d + "s infinite" }} />)}
          </div>
          <p style={{ fontSize: 14, margin: 0 }}>On cherche vos recettes...</p>
          <style>{"@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}"}</style>
        </div>
      )}

      {error && <div style={{ padding: "12px 16px", background: "#FCEBEB", color: "#791F1F", borderRadius: 10, marginBottom: "1rem", fontSize: 13 }}><strong>Erreur :</strong> {error}</div>}

      {results && (
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN_MED, display: "inline-block" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Prêt à cuisiner maintenant</h2>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {(results.recipes_now || []).map((r, i) => <RecipeCard key={i} recipe={r} isAddition={false} />)}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: AMBER_MED, display: "inline-block" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Si vous ajoutez quelques ingrédients...</h2>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {(results.recipes_with_additions || []).map((r, i) => <RecipeCard key={i} recipe={r} isAddition={true} />)}
            </div>
          </div>
          <ShoppingList recipes={results.recipes_with_additions || []} />
        </div>
      )}
    </div>
  );


