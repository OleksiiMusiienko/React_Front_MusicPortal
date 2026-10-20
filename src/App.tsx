import './App.css'
import { useState } from 'react';
import UserComponent from './components/UsersComponent';
import SongsComponent from './components/SongsComponent';
import GenresComponent from './components/GenresComponent';

function App() {
  const [selectedTab, setTab] = useState(1);
  const styles = {
    tab: (isActive: boolean) => ({
      padding: '10px 20px',
      cursor: 'pointer',
      borderBottom: isActive ? '3px solid #007bff' : 'none',
      color: isActive ? '#007bff' : '#666',
      fontWeight: isActive ? 'bold' : 'normal',
    })
  }
  return (

    <div className="app-layout">

      {/* HEADER */}
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo">MyDevPortfolio</a>
          <nav>
            <ul className="nav-links">
              <li><a href="#">Проекты</a></li>
              <li><a href="#">О себе</a></li>
              <li><a href="#">Контакты</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-content">
        <div className="container">

          <section className="hero">
            <h1>Кабинет администратора MusicPortal</h1>
          </section>

          <section className="projects-grid">

            {/* Заголовки вкладок */}
            <div className='tabList'>
              <div
                style={styles.tab(selectedTab === 1)}
                onClick={() => setTab(1)}
              >
                Пользователи
              </div>
              <div
                style={styles.tab(selectedTab === 2)}
                onClick={() => setTab(2)}
              >
                Песни
              </div>
              <div
                style={styles.tab(selectedTab === 3)}
                onClick={() => setTab(3)}
              >
                Жанры
              </div>
            </div>

            {/* Контент вкладок */}
            <div className="tab-content">
              {selectedTab === 1 && (
                <UserComponent />
              )}
              {selectedTab === 2 && (
                <SongsComponent />
              )}
              {selectedTab === 3 && (
               <GenresComponent/>
              )}
            </div>

          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} — Учебный проект. Сделано с ❤️</p>
        </div>
      </footer>

    </div>

  )
}

export default App
