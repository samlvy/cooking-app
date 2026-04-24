import { useState } from "react";

const GREEN_DARK = "#27500A";
const GREEN_MED = "#3B6D11";
const GREEN_LIGHT = "#EAF3DE";
const AMBER_DARK = "#633806";
const AMBER_MED = "#BA7517";
const AMBER_LIGHT = "#FAEEDA";

const FILTERS = [
  { id: "vegetarien", label: "Vegetarien" },
  { id: "sans_gluten", label: "Sans gluten" },
  { id: "rapide", label: "Rapide -20 min" },
  { id: "budget", label: "Budget serre" },
];

function getShortsUrl(query) {
  const q = encodeURIComponent(query + " recette");
  const web = "https://www.youtube.com/results?search_query=" + q + "&sp=EgIYAQ%3D%3D";
  const app = "youtube://" + q;
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  return isMobile ? app : web;
}

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem("cooking_prefs") || "{}"); } catch { return {}; }
}

function savePrefs(prefs) {
  try { localStorage.setItem("cooking_prefs", JSON.stringify(prefs)); } catch {}
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

function RecipeCard({ recipe, isAddition, onFeedback }) {
  const [feedback, setFeedback] = useState(null);
  const accent = isAddition ? AMBER_MED : GREEN_MED;

  function handleFeedback(type) {
    setFeedback(type);
    onFeedback(recipe.name, type);
  }

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
      {recipe.used_ingredients && recipe.used_ingredients.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#888", marginRight: 2 }}>Utilise :</span>
          {recipe.used_ingredients.map((ing, i) => <span key={i} style={{ fontSize: 12, padding: "2px 8px", background: GREEN_LIGHT, color: GREEN_DARK, borderRadius: 99 }}>{ing}</span>)}
        </div>
      )}
      {isAddition && recipe.additional_ingredients && recipe.additional_ingredients.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#888", marginRight: 2 }}>A ajouter :</span>
          {recipe.additional_ingredients.map((ing, i) => <span key={i} style={{ fontSize: 12, padding: "2px 8px", background: AMBER_LIGHT, color: AMBER_DARK, borderRadius: 99 }}>+ {ing}</span>)}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <a href={getShortsUrl(recipe.youtube_query || recipe.name)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#FF0000", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
          Voir sur YouTube Shorts
        </a>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#888" }}>Cette recette ?</span>
          <button onClick={() => handleFeedback("like")} style={{ background: feedback === "like" ? GREEN_MED : "#f0f0ed", border: "none", borderRadius: 99, padding: "4px 10px", cursor: "pointer", fontSize: 14 }}>👍</button>
          <button onClick={() => handleFeedback("dislike")} style={{ background: feedback === "dislike" ? "#FCEBEB" : "#f0f0ed", border: "none", borderRadius: 99, padding: "4px 10px", cursor: "pointer", fontSize: 14 }}>👎</button>
        </div>
      </div>
    </div>
  );
}

function ShoppingList({ recipes }) {
  const [copied, setCopied] = useState(false);
  const allMissing = [...new Set(recipes.flatMap(r => r.additional_ingredients || []))];
  if (!allMissing.length) return null;
  const listText = "Liste de courses :\n" + allMissing.map(i => "- " + i).join("\n");
  function copyList() {
    navigator.clipboard.writeText(listText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "1.25rem", marginTop: "1.5rem" }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: "0 0 14px" }}>Liste de courses</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {allMissing.map((ing, i) => <span key={i} style={{ fontSize: 13, padding: "4px 10px", background: AMBER_LIGHT, color: AMBER_DARK, borderRadius: 99 }}>+ {ing}</span>)}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={copyList} style={{ flex: 1, padding: "9px 0", background: copied ? GREEN_MED : "#f0f0ed", color: copied ? GREEN_LIGHT : "#333", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{copied ? "Copie !" : "Copier la liste"}</button>
        <button onClick={() => window.open("sms:?body=" + encodeURIComponent(listText))} style={{ flex: 1, padding: "9px 0", background: GREEN_DARK, color: GREEN_LIGHT, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Envoyer par SMS</button>
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
  const [prefs, setPrefs] = useState(loadPrefs);

  function handleFeedback(recipeName, type) {
    const updated = { ...prefs };
    if (!updated.liked) updated.liked = [];
    if (!updated.disliked) updated.disliked = [];
    if (type === "like" && !updated.liked.includes(recipeName)) updated.liked.push(recipeName);
    if (type === "dislike" && !updated.disliked.includes(recipeName)) updated.disliked.push(recipeName);
    updated.liked = updated.liked.slice(-20);
    updated.disliked = updated.disliked.slice(-20);
    setPrefs(updated);
    savePrefs(updated);
  }

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
    if (!ingredients.length) { setError("Ajoutez au moins un ingredient !"); return; }
    setError(""); setResults(null); setLoading(true);
    const many = ingredients.length >= 4;
    const filterLabels = activeFilters.map(id => FILTERS.find(f => f.id === id)?.label).filter(Boolean);
    const filterNote = filterLabels.length ? "Contraintes : " + filterLabels.join(", ") + "." : "";
    const likedNote = prefs.liked?.length ? "Aime par le passe : " + prefs.liked.join(", ") + "." : "";
    const dislikedNote = prefs.disliked?.length ? "Pas aime : " + prefs.disliked.join(", ") + "." : "";
    const prompt = "Ingredients : " + ingredients.join(", ") + ". " + filterNote + " " + likedNote + " " + dislikedNote + " REGLE ABSOLUE : recipes_now = UNIQUEMENT recettes avec exactement ces ingredients. Tout le reste va dans recipes_with_additions. Logique culinaire : pates = plats de pates. Retourne JSON : recipes_now (" + (many ? 4 : 3) + " recettes : { name, description, difficulty: Facile|Moyen|Difficile, time, youtube_query, used_ingredients[] }) et recipes_with_additions (3 recettes : { name, description, difficulty, time, youtube_query, used_ingredients[], additional_ingredients[] }).";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": (import.meta.env.VITE_ANTHROPIC_API_KEY || "").trim(), "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1400, system: "Chef culinaire expert. JSON valide brut uniquement, sans markdown. En francais.", messages: [{ role: "user", content: prompt }] })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const textBlock = data.content?.find(b => b.type === "text");
      if (!textBlock) throw new Error("Pas de contenu.");
      const clean = textBlock.text.replace(/```json/g, "").replace(/```/g, "").trim(); const parsed = JSON.parse(clean);
      const ingLower = ingredients.map(i => i.toLowerCase());
      const strict = (parsed.recipes_now || []).filter(r => (r.used_ingredients || []).map(u => u.toLowerCase()).every(u => ingLower.some(i => u.includes(i) || i.includes(u))));
      const moved = (parsed.recipes_now || []).filter(r => !(r.used_ingredients || []).map(u => u.toLowerCase()).every(u => ingLower.some(i => u.includes(i) || i.includes(u)))).map(r => ({ ...r, additional_ingredients: (r.used_ingredients || []).filter(u => !ingLower.some(i => u.toLowerCase().includes(i) || i.includes(u.toLowerCase()))) }));
      parsed.recipes_now = strict;
      parsed.recipes_with_additions = [...moved, ...(parsed.recipes_with_additions || [])];
      setResults(parsed);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  const hasPrefs = (prefs.liked?.length || 0) + (prefs.disliked?.length || 0) > 0;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 660, margin: "0 auto", padding: "1.5rem 1rem", background: "#fafaf8", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>Qu est-ce qu on mange ?</h1>
        <p style={{ fontSize: 14, color: "#666", margin: 0 }}>Entrez vos ingredients, on s occupe du reste.</p>
        {hasPrefs && <p style={{ fontSize: 12, color: GREEN_MED, margin: "4px 0 0" }}>L appli connait vos gouts ({prefs.liked?.length || 0} aimes, {prefs.disliked?.length || 0} pas aimes)</p>}
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && addIngredient()} placeholder="ex: poulet, tomates, ail..." style={{ flex: 1, padding: "8px 12px", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafaf8", color: "#1a1a1a" }} />
          <button onClick={addIngredient} style={{ padding: "0 16px", background: GREEN_MED, color: GREEN_LIGHT, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", height: 38 }}>+ Ajouter</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 32 }}>
          {ingredients.length === 0 ? <span style={{ fontSize: 13, color: "#aaa", paddingTop: 6 }}>Aucun ingredient ajoute...</span> : ingredients.map((ing, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#f0f0ed", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 99, fontSize: 13, color: "#333" }}>
              {ing}
              <button onClick={() => setIngredients(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 16, padding: 0, lineHeight: 1 }}>x</button>
            </span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>Filtres :</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => toggleFilter(f.id)} style={{ padding: "6px 12px", background: activeFilters.includes(f.id) ? GREEN_DARK : "#fff", color: activeFilters.includes(f.id) ? GREEN_LIGHT : "#444", border: "0.5px solid " + (activeFilters.includes(f.id) ? GREEN_DARK : "rgba(0,0,0,0.15)"), borderRadius: 99, fontSize: 13, cursor: "pointer", fontWeight: activeFilters.includes(f.id) ? 600 : 400 }}>{f.label}</button>
          ))}
        </div>
      </div>
      <button onClick={findRecipes} disabled={loading} style={{ width: "100%", padding: "12px 16px", background: loading ? "#aaa" : GREEN_DARK, color: GREEN_LIGHT, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginBottom: "1.5rem" }}>
        {loading ? "Recherche en cours..." : "Trouver mes recettes"}
      </button>
      {loading && <div style={{ textAlign: "center", padding: "2rem 0", color: "#666" }}><p style={{ fontSize: 14, margin: 0 }}>On cherche vos recettes...</p></div>}
      {error && <div style={{ padding: "12px 16px", background: "#FCEBEB", color: "#791F1F", borderRadius: 10, marginBottom: "1rem", fontSize: 13 }}><strong>Erreur :</strong> {error}</div>}
      {results && (
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: GREEN_MED, display: "inline-block" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Pret a cuisiner maintenant</h2>
            </div>
            {results.recipes_now && results.recipes_now.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>{results.recipes_now.map((r, i) => <RecipeCard key={i} recipe={r} isAddition={false} onFeedback={handleFeedback} />)}</div>
            ) : (
              <p style={{ fontSize: 14, color: "#888", fontStyle: "italic" }}>Pas assez d ingredients pour une recette complete. Regardez les suggestions ci-dessous !</p>
            )}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: AMBER_MED, display: "inline-block" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Si vous ajoutez quelques ingredients...</h2>
            </div>
            <div style={{ display: "grid", gap: 10 }}>{(results.recipes_with_additions || []).map((r, i) => <RecipeCard key={i} recipe={r} isAddition={true} onFeedback={handleFeedback} />)}</div>
          </div>
          <ShoppingList recipes={results.recipes_with_additions || []} />
        </div>
      )}
    </div>
  );
}
