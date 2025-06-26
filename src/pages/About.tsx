
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <ScrollReveal>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к галерее
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Как создавался RFD MUSEUM
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            История создания интерактивной галереи музыкальных обложек с помощью Lovable AI
          </p>
        </ScrollReveal>

        <div className="space-y-16">
          <ScrollReveal delay={600}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">🤖 Магия Lovable AI</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Этот проект был создан с помощью Lovable - революционного AI-редактора для веб-приложений. 
                Вместо месяцев разработки, весь сайт был построен через естественный диалог с ИИ. 
                Каждая функция, каждая анимация, каждый компонент создавались в реальном времени через простые инструкции.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">⚛️ Современный Tech Stack</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">Frontend</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• React 18 с TypeScript</li>
                    <li>• Vite для быстрой сборки</li>
                    <li>• Tailwind CSS для стилизации</li>
                    <li>• Shadcn/ui компоненты</li>
                  </ul>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-green-400">Специальные возможности</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• React Query для данных</li>
                    <li>• React Router для навигации</li>
                    <li>• Lucide React иконки</li>
                    <li>• Next Themes для тем</li>
                  </ul>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1000}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">🎨 Уникальные функции</h2>
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">Виртуализация бесконечного канваса</h3>
                  <p className="text-gray-300">
                    Создана система виртуализации, которая отображает только видимые элементы, 
                    позволяя показывать тысячи обложек без потери производительности.
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-yellow-400">Алгоритм Poisson Disk Sampling</h3>
                  <p className="text-gray-300">
                    Математический алгоритм для создания естественного, но структурированного размещения элементов 
                    с минимальным расстоянием между ними.
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-red-400">Детерминированная рандомизация</h3>
                  <p className="text-gray-300">
                    Система генерации "случайных" позиций и анимаций, которые остаются стабильными 
                    между перезагрузками страницы.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1200}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">🎵 Аудио система</h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                Интегрирована продвинутая аудио система с:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Умной обработкой разрешений браузера на автовоспроизведение</li>
                <li>• Toast-уведомлениями для лучшего UX</li>
                <li>• Состояниями загрузки и обработкой ошибок</li>
                <li>• Элегантным плавающим плеером с blur-эффектом</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1400}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">✨ Анимации и интерактивность</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed text-lg">
                  Каждое взаимодействие продумано до мелочей:
                </p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li>• Плавные переходы между светлой и темной темами</li>
                  <li>• Анимации появления элементов при скролле</li>
                  <li>• Hover-эффекты с backdrop-blur</li>
                  <li>• Летающие анимации обложек</li>
                  <li>• Smooth scrolling и momentum</li>
                </ul>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1600}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">📱 Адаптивный дизайн</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Сайт полностью адаптивен и работает на всех устройствах - от мобильных телефонов 
                до больших десктопных мониторов. Используются современные CSS Grid и Flexbox 
                для создания гибких макетов.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1800}>
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-white">🚀 Производительность</h2>
              <div className="bg-gray-900 p-6 rounded-lg">
                <ul className="text-gray-300 space-y-3">
                  <li>• <strong className="text-white">Lazy Loading:</strong> Изображения загружаются по мере необходимости</li>
                  <li>• <strong className="text-white">Виртуализация:</strong> Рендерятся только видимые элементы</li>
                  <li>• <strong className="text-white">Мемоизация:</strong> React hooks оптимизированы для избежания лишних пересчетов</li>
                  <li>• <strong className="text-white">Webpack оптимизация:</strong> Сборка оптимизирована для продакшена</li>
                </ul>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={2000}>
            <section className="border-t border-gray-800 pt-12">
              <h2 className="text-3xl font-semibold mb-6 text-white">💡 Философия проекта</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                RFD MUSEUM - это не просто галерея музыкальных обложек. Это демонстрация того, 
                как современные технологии и ИИ могут создавать по-настоящему уникальные 
                пользовательские интерфейсы. Каждый элемент здесь служит цели создания 
                незабываемого опыта взаимодействия с музыкальным контентом.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={2200}>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Создано с ❤️ с помощью Lovable AI
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default About;
