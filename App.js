// src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Ses dosyası ve ilgili kodlar kaldırıldı.

// ===== Yardımcı Fonksiyonlar ve Bileşen Tanımları =====
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Timer Bileşeni ---
function Timer({ workDuration, breakDuration }) {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  // audioRef kaldırıldı.

  // Sesle ilgili useEffect kaldırıldı.

  useEffect(() => {
    // Bu kısım, süreler veya mod değiştiğinde (timer duruyorken)
    // zamanı ilgili modun başlangıç süresine ayarlar.
    // Durdurulmuş bir süreyi SIFIRLAMAZ.
    if (!isActive) {
      setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    }
  }, [workDuration, breakDuration, mode]); // isActive bağımlılığı kaldırıldı,
                                           // böylece durdurunca süre sıfırlanmaz.

  useEffect(() => {
     document.title = `${formatTime(timeLeft)} - ${mode === 'work' ? 'Çalışma' : 'Mola'} | Pomodoro Beta`;
   }, [timeLeft, mode]);

  // Zamanlayıcı ana mantığı
  useEffect(() => {
    if (isActive) {
      // Timer aktif ise, her saniye timeLeft'i 1 azalt.
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) { // Süre bittiğinde
            clearInterval(intervalRef.current);
            const nextMode = mode === 'work' ? 'break' : 'work';

            // Sadece alert göster (Ses çalma kodu kaldırıldı)
            alert(`${mode === 'work' ? 'Çalışma' : 'Mola'} süresi bitti! Şimdi ${nextMode === 'work' ? 'çalışma' : 'mola'} zamanı.`);

            setMode(nextMode);
            // Süre bitince, yeni modun tam süresini ayarla
            setTimeLeft(nextMode === 'work' ? workDuration * 60 : breakDuration * 60);
            setIsActive(false); // Timer'ı durdur
            return 0;
          }
          // Süre bitmediyse 1 azaltarak devam et
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Timer aktif değilse (durdurulduysa), interval'ı temizle.
      // timeLeft mevcut değerinde kalır.
      clearInterval(intervalRef.current);
    }
    // Component unmount olduğunda veya isActive/mode/süreler değiştiğinde
    // interval'ı temizle (bellek sızıntısını önler)
    return () => clearInterval(intervalRef.current);
  }, [isActive, mode, workDuration, breakDuration]);

  const toggleTimer = () => {
    // Sadece isActive durumunu tersine çevirir.
    // useEffect içindeki mantık durdurma/devam ettirmeyi halleder.
    setIsActive(!isActive);
    // Sesle ilgili ilk tıklama kodu kaldırıldı.
  };

  const resetTimer = () => {
    // Timer'ı durdurur ve zamanı mevcut modun başlangıç süresine ayarlar.
    clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    // Ses durdurma kodu kaldırıldı.
  };

   const switchMode = (newMode) => {
    // Farklı bir moda geçiliyorsa
    if (mode !== newMode) {
        clearInterval(intervalRef.current); // Önce çalışan interval'ı durdur
        setIsActive(false);                 // Aktif durumu kapat
        setMode(newMode);                   // Yeni modu ayarla
        // Yeni modun başlangıç süresini ayarla (timeLeft sıfırlanır)
        setTimeLeft(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
    }
  };

  const timerContainerClass = `timer-container ${mode === 'work' ? 'work-mode-bg' : 'break-mode-bg'}`;

  return (
    <div className={timerContainerClass}>
      <div className="timer-mode">{mode === 'work' ? 'Çalışma Zamanı' : 'Mola Zamanı'}</div>
      <div className="time-display">{formatTime(timeLeft)}</div>
      <div className="timer-controls">
        <button onClick={() => switchMode('work')} className="secondary-action mode-switch" disabled={mode === 'work'} title="Çalışma Moduna Geç">Çalışma</button>
        <button onClick={() => switchMode('break')} className="secondary-action mode-switch" disabled={mode === 'break'} title="Mola Moduna Geç">Mola</button>
        <button onClick={toggleTimer} className={`main-action ${isActive ? 'pause' : ''}`}>{isActive ? 'Durdur' : 'Başlat'}</button>
        <button onClick={resetTimer} className="secondary-action reset" title="Sıfırla">Sıfırla</button>
      </div>
      <div className="motivational-quote-container">
         <p className="motivational-quote">"Ya bir yol bulacağız ya da bir yol yapacağız."</p>
         <p className="quote-author">Hannibal</p>
       </div>
    </div>
  );
}

// --- Settings Bileşeni ---
// (Settings bileşeninde değişiklik yok)
function Settings({ initialWork, initialBreak, onSave, onClose }) {
  const [tempWork, setTempWork] = useState(initialWork);
  const [tempBreak, setTempBreak] = useState(initialBreak);

  const handleWorkChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
       setTempWork(value);
    } else if (e.target.value === '') {
        setTempWork('');
    }
  };

  const handleBreakChange = (e) => {
     const value = parseInt(e.target.value, 10);
     if (!isNaN(value) && value > 0) {
       setTempBreak(value);
    } else if (e.target.value === '') {
        setTempBreak('');
    }
  };

  const handleSave = () => {
      if (tempWork > 0 && tempBreak > 0) {
        onSave(tempWork, tempBreak);
        onClose();
      } else {
          alert("Lütfen çalışma ve mola süreleri için geçerli pozitif sayılar girin.");
      }
  };

  return (
    <div className="settings-panel">
      <h3>Ayarlar</h3>
      <div className="settings-group">
        <label htmlFor="work-duration">Çalışma Süresi (dk):</label>
        <input type="number" id="work-duration" value={tempWork} onChange={handleWorkChange} min="1"/>
      </div>
      <div className="settings-group">
        <label htmlFor="break-duration">Mola Süresi (dk):</label>
        <input type="number" id="break-duration" value={tempBreak} onChange={handleBreakChange} min="1"/>
      </div>
      <button onClick={handleSave} className="save-button">Tamam</button>
    </div>
  );
}


// ===== Ana App Bileşeni =====
// (Ana App bileşeninde değişiklik yok)
function App() {
  const initialWorkDuration = parseInt(localStorage.getItem('pomodoroWorkDuration'), 10) || 25;
  const initialBreakDuration = parseInt(localStorage.getItem('pomodoroBreakDuration'), 10) || 5;

  const [workDuration, setWorkDuration] = useState(initialWorkDuration);
  const [breakDuration, setBreakDuration] = useState(initialBreakDuration);
  const [showSettings, setShowSettings] = useState(false);

  const saveSettings = useCallback((newWork, newBreak) => {
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
    localStorage.setItem('pomodoroWorkDuration', newWork);
    localStorage.setItem('pomodoroBreakDuration', newBreak);
  }, []);


  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="App">
      <div className="top-right-controls">
         <h1 className="app-logo-top-right">
           Pomodoro App <span className="beta">Beta</span>
         </h1>
        {!showSettings && (
          <button onClick={toggleSettings} className="settings-button" title="Ayarlar">
            ⚙️
          </button>
         )}
      </div>

      {!showSettings ? (
        <Timer
          key={workDuration + '-' + breakDuration}
          workDuration={workDuration}
          breakDuration={breakDuration}
        />
      ) : (
        <Settings
          initialWork={workDuration}
          initialBreak={breakDuration}
          onSave={saveSettings}
          onClose={toggleSettings}
        />
      )}
    </div>
  );
}

export default App;