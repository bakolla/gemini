import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./styles.css";

const assistants = [
    { key: "unit", label: "Testy jednostkowe" },
    { key: "solid", label: "SOLID / Demeter" },
    { key: "quality", label: "Analiza jakości" },
    { key: "cases", label: "Przypadki testowe" },
    { key: "docs", label: "Dokumentacja testów" },
    { key: "review", label: "Recenzja kodu" },
    { key: "coverage", label: "Pokrycie testami" },
];

const assistantDescriptions = {
    unit: "Generuję kompletne testy jednostkowe dla Twojego kodu – uwzględniam wszystkie możliwe scenariusze.",
    solid: "Analizuję kod pod kątem zasad SOLID i Prawa Demeter – wskazuję naruszenia i jak je naprawić.",
    quality: "Oceniam jakość kodu – styl, struktura, wydajność. Otrzymasz konkretne sugestie poprawek.",
    cases: "Tworzę zestaw przypadków testowych – dane wejściowe, kroki testowe i oczekiwane wyniki.",
    docs: "Tworzę przejrzystą dokumentację testów na podstawie Twojego kodu.",
    review: "Recenzuję Twój kod – znajdę błędy, antywzorce i zaproponuję dobre praktyki.",
    coverage: "Analizuję pokrycie testami – wykrywam luki i podpowiadam brakujące testy.",
};

const prompts = {
    unit: `Jestem ekspertem od testowania – wygeneruj testy jednostkowe na podstawie poniższego kodu. Upewnij się, że testują wszystkie ścieżki wykonania.\nKod:\n`,
    solid: `Jestem ekspertem od analizy kodu – przeanalizuj poniższy kod pod kątem naruszeń zasad SOLID oraz Prawa Demeter. Wypisz znalezione problemy i zaproponuj poprawki.\nKod:\n`,
    quality: `Jestem ekspertem od jakości – przeprowadź analizę jakości poniższego kodu: oceń czytelność, strukturę, wydajność oraz zaproponuj ulepszenia.\nKod:\n`,
    cases: `Jestem ekspertem QA – na podstawie poniższego kodu wygeneruj tabelę przypadków testowych: dane wejściowe, kroki, oczekiwany rezultat.\nKod:\n`,
    docs: `Jestem ekspertem QA – przygotuj dokumentację przypadków testowych dla poniższego kodu. Każdy przypadek powinien zawierać opis, kroki, dane testowe oraz oczekiwany wynik.\nKod:\n`,
    review: `Jestem ekspertem od code review – zrecenzuj poniższy kod pod kątem typowych błędów i dobrych praktyk. Wskaż sugestie poprawek.\nKod:\n`,
    coverage: `Jestem ekspertem QA – przeanalizuj poniższy kod pod kątem pokrycia testami. Wypisz, które fragmenty NIE są pokryte i zaproponuj brakujące przypadki.\nKod:\n`,
};

export default function App() {
    const [selected, setSelected] = useState("unit");
    const [code, setCode] = useState("");
    const [result, setResult] = useState("");
    const [history, setHistory] = useState([]);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });
    const fileInputRef = useRef(null);
    const [copied, setCopied] = useState({ code: false, result: false });

    const handleCopy = (text, target) => {
        navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [target]: true }));
        setTimeout(() => setCopied((prev) => ({ ...prev, [target]: false })), 1500);
    };

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "";
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const handleClick = async () => {
        if (!code.trim()) {
            setResult("⚠️ Wklej kod do analizy.");
            return;
        }

        setResult("⏳ Proszę czekać...");
        try {
            const payload = { codeSnippet: `${prompts[selected]}${code}` };
            const res = await axios.post("http://localhost:4000/analyze", payload);
            const analysis = res.data.analysis;

            setResult(analysis);
            setHistory((prev) => [
                {
                    id: Date.now(),
                    promptType: selected,
                    code,
                    result: analysis,
                },
                ...prev,
            ]);
        } catch (err) {
            setResult("❌ Błąd komunikacji z backendem.");
        }
    };

    const handleDownload = () => {
        const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "analiza.txt";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => setCode(evt.target.result);
        reader.readAsText(file);
    };

    return (
        <div className="main-layout">
            <aside className="sidebar">
                <div className="theme-toggle-row">
                    <h3 style={{ margin: 0 }}>Asystent AI</h3>
                    <button
                        className="theme-toggle"
                        onClick={() => setDarkMode((dm) => !dm)}
                    >
                        {darkMode ? "🌙" : "☀️"}
                    </button>
                </div>
                <ul>
                    {assistants.map((item) => (
                        <li
                            key={item.key}
                            className={selected === item.key ? "active" : ""}
                            onClick={() => setSelected(item.key)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </aside>

            <section className="content">
                <h2>{assistants.find((a) => a.key === selected).label}</h2>
                <p className="assistant-desc">{assistantDescriptions[selected]}</p>

                <div className="textbox-copy-wrap">
          <textarea
              placeholder="Wklej fragment kodu…"
              value={code}
              onChange={(e) => setCode(e.target.value)}
          />
                    <button
                        className="copy-btn"
                        title="Kopiuj kod"
                        onClick={() => handleCopy(code, "code")}
                    >
                        {copied.code ? "✅" : "📋"}
                    </button>
                </div>

                <div className="button-row">
                    <button className="analyze-btn" onClick={handleClick}>
                        Analizuj Kod
                    </button>
                    <input
                        type="file"
                        accept=".js,.jsx,.java,.py,.txt"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <button
                        className="analyze-btn file-upload-btn"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{ marginLeft: "12px" }}
                    >
                        Wybierz plik z kodem
                    </button>
                    {result && !result.startsWith("⏳") && (
                        <button
                            className="analyze-btn download-btn"
                            onClick={handleDownload}
                            style={{ marginLeft: "12px" }}
                        >
                            Pobierz wynik
                        </button>
                    )}
                </div>

                <div className="textbox-copy-wrap result-copy-wrap">
                    <div className="result">
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                    <button
                        className="copy-btn"
                        title="Kopiuj wynik"
                        onClick={() => handleCopy(result, "result")}
                    >
                        {copied.result ? "✅" : "📋"}
                    </button>
                </div>

                {history.length > 0 && (
                    <div style={{ marginTop: "28px" }}>
                        <h3>📜 Historia analiz</h3>
                        <button
                            style={{
                                marginBottom: "10px",
                                background: "#eee",
                                padding: "6px 12px",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                            onClick={() => setHistory([])}
                        >
                            🗑️ Wyczyść historię
                        </button>
                        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                            {history.map((entry) => (
                                <li
                                    key={entry.id}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: 6,
                                        padding: "10px 14px",
                                        marginBottom: "10px",
                                        background: "#f4f6fb",
                                    }}
                                >
                                    <b>
                                        {assistants.find((a) => a.key === entry.promptType)?.label}
                                    </b>
                                    <div
                                        style={{
                                            marginTop: 8,
                                            marginBottom: 8,
                                            fontSize: "14px",
                                            whiteSpace: "pre-line",
                                        }}
                                    >
                                        {entry.result.slice(0, 200)}
                                        {entry.result.length > 200 ? "…" : ""}
                                    </div>
                                    <button
                                        className="analyze-btn"
                                        style={{ padding: "6px 12px", fontSize: 14 }}
                                        onClick={() => {
                                            setCode(entry.code);
                                            setResult(entry.result);
                                            setSelected(entry.promptType);
                                        }}
                                    >
                                        🔄 Przywróć
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}
