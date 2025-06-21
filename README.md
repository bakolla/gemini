**Aleksandra Bąk, systemy inteligentne, 3 rok** 



**Opis aplikacji** 

Aplikacja "Asystent AI" to narzędzie wspierające testerów i inżynierów jakości oprogramowania w analizie kodu źródłowego. Za pomocą modeli językowych Gemini API, użytkownik może generować testy, recenzje kodu, analizować pokrycie testami i więcej – wszystko przez prosty, interaktywny interfejs webowy. 



**Funkcjonalności interfejsu** 

**Menu asystentów (lewy panel)** 

- Lista dostępnych asystentów AI: 
- Testy jednostkowe 
- SOLID / Demeter 
- Analiza jakości 
- Przypadki testowe 
- Dokumentacja testów 
- Recenzja kodu 
- Pokrycie testami 
- Kliknięcie danej opcji ustawia aktywnego asystenta. 
- Aktywna opcja podświetlona i wyróżniona. 



**Tryb ciemny / jasny**  

- Przełącznik motywu aplikacji – dostępny w górnej części panelu bocznego. 
- Wyboru motywu zapamiętywany w localStorage. 
- Automatyczne przeładowanie stylów zależnie od motywu. 



**Opis aktywnego asystenta** 

- Pod tytułem aktywnej sekcji wyświetla się krótki opis działania wybranego AI. 
- Przykład: *"Generuję kompletne testy jednostkowe dla Twojego kodu..."* 







**Wprowadzanie kodu** 

- Główne pole tekstowe – umożliwia wklejenie fragmentu kodu do analizy. 
- Obok znajduje się ikona kopiowania** pozwalająca skopiować kod do schowka. 
- Alternatywnie użytkownik może wczytać plik lokalny (.js, .py, .java, .txt) klikając przycisk "Wybierz plik z kodem". 



**Przycisk „Analizuj Kod”** 

- Wysyła aktualny kod + prompt (zależnie od wybranego asystenta) do backendu. 
- W odpowiedzi otrzymuje wygenerowaną analizę / testy / przypadki itd. z API Gemini. 



**Wynik analizy** 

- Pokazuje się pod kodem – sformatowany z użyciem ReactMarkdown (zachowuje nagłówki, listy itd.). 
- Możliwość skopiowania wyniku do schowka  
- Możliwość pobrania wyniku jako pliku .txt. 



**Historia analiz** 

- Każda analiza zapisywana jest do historii lokalnej (w pamięci aplikacji). 
- Historia wyświetlana na dole strony – zawiera: 
- Typ asystenta 
- Skrócony wynik (pierwsze 200 znaków) 
- Przycisk "Przywróć" – wczytuje poprzedni kod, wynik i tryb. 
- Przycisk **"**Wyczyść historię" – usuwa całą historię analiz. 



**Technologie użyte w projekcie** 

|**Komponent** |**Technologia** |
| :-: | :-: |
|Frontend |React + Vite |
|Stylowanie |CSS (własny styl + ciemny motyw) |
|Markdown |react-markdown |
|Backend |Node.js + Express |
|API |Gemini 1.5 (via REST) |
|Komunikacja |axios |





` `**Sposób działania (flow użytkownika)** 

1. Użytkownik wybiera rodzaj analizy z panelu bocznego. 
2. Wkleja kod lub wybiera plik. 
3. Klikając „Analizuj Kod” – wysyła żądanie do backendu. 
4. Backend przesyła zapytanie do Gemini API z odpowiednim promptem. 
5. Wynik wyświetlany jest użytkownikowi + zapisywany w historii. 
6. Użytkownik może go pobrać, skopiować lub wrócić do poprzednich. 



**Pliki aplikacji** 

|**Plik / folder** |**Opis** |
| :-: | :-: |
|App.jsx |Główna logika i interfejs |
|styles.css |Stylowanie + motyw ciemny |
|server.js (backend) |Obsługa API Gemini |
|.env |Klucz Gemini |
|index.html (frontend) |Kontener dla aplikacji |







![Image](https://github.com/user-attachments/assets/f484d48e-1612-440b-a6a3-ce21b0f297c1)
![Image](https://github.com/user-attachments/assets/4c7f8039-68f0-460c-a135-bf034a79f662)
![Image](https://github.com/user-attachments/assets/bc038f58-9dcb-4f0d-a37e-b94d9dc8e972)
