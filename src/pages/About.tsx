
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-stone-100 font-ys">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <ScrollReveal delay={0} baseOpacity={0} baseRotation={1}>
          <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-300 transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к галерее
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={200} baseOpacity={0} baseRotation={2} textClassName="text-5xl mb-8 text-stone-50 font-extrabold">
          История создания RFD MUSEUM
        </ScrollReveal>

        <ScrollReveal delay={400} baseOpacity={0.1} baseRotation={1} textClassName="text-stone-300 mb-16 leading-relaxed text-xl">
          Рассказ о том, как интерактивная галерея музыкальных обложек была создана с помощью искусственного интеллекта
        </ScrollReveal>

        <div className="space-y-20">
          <ScrollReveal delay={600} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Всё началось с простой идеи — создать интерактивную галерею для музыкальных обложек. Но вместо традиционной разработки, я решил попробовать что-то революционное.
          </ScrollReveal>

          <ScrollReveal delay={800} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Lovable AI стал моим партнёром в этом проекте. Через естественный диалог на русском языке я описывал желаемые функции, а ИИ мгновенно воплощал их в код.
          </ScrollReveal>

          <ScrollReveal delay={1000} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Каждая строчка кода, каждая анимация, каждый компонент — всё создавалось в реальном времени через простые инструкции. Это было похоже на магию.
          </ScrollReveal>

          <ScrollReveal delay={1200}>
            <section>
              <h2 className="text-3xl font-semibold mb-8 text-stone-100">Технологический фундамент</h2>
              <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-stone-200">Основа</h3>
                    <ul className="text-stone-300 space-y-2">
                      <li>React 18 с TypeScript</li>
                      <li>Vite для быстрой сборки</li>
                      <li>Tailwind CSS для стилизации</li>
                      <li>Shadcn/ui компоненты</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-stone-200">Расширения</h3>
                    <ul className="text-stone-300 space-y-2">
                      <li>React Query для данных</li>
                      <li>React Router для навигации</li>
                      <li>Lucide React для иконок</li>
                      <li>Next Themes для переключения тем</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1400} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Самой сложной частью стала реализация бесконечного канваса. Нужно было показать сотни обложек одновременно, но без потери производительности.
          </ScrollReveal>

          <ScrollReveal delay={1600} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Lovable AI предложил элегантное решение — виртуализацию. Система отображает только те элементы, которые видны пользователю в данный момент.
          </ScrollReveal>

          <ScrollReveal delay={1800} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Для естественного размещения элементов мы использовали алгоритм Poisson Disk Sampling — математическую модель, которая создаёт органичное, но структурированное расположение.
          </ScrollReveal>

          <ScrollReveal delay={2000}>
            <section>
              <h2 className="mb-8 text-stone-100 text-4xl font-extrabold">Уникальные решения</h2>
              <div className="space-y-6">
                <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
                  <h3 className="text-xl font-medium mb-3 text-stone-200">Виртуализация бесконечного канваса</h3>
                  <p className="text-stone-300 leading-relaxed">
                    Система отображает только видимые элементы, позволяя показывать тысячи обложек 
                    без потери производительности. Элементы динамически создаются и удаляются 
                    при прокрутке.
                  </p>
                </div>
                <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
                  <h3 className="text-xl font-medium mb-3 text-stone-200">Алгоритм Poisson Disk Sampling</h3>
                  <p className="text-stone-300 leading-relaxed">
                    Математический алгоритм для создания естественного размещения элементов 
                    с минимальным расстоянием между ними. Каждая обложка имеет своё уникальное 
                    место в пространстве.
                  </p>
                </div>
                <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
                  <h3 className="text-xl font-medium mb-3 text-stone-200">Детерминированная рандомизация</h3>
                  <p className="text-stone-300 leading-relaxed">
                    Позиции и анимации генерируются псевдослучайно, но остаются стабильными 
                    между перезагрузками. Каждый пользователь видит одну и ту же композицию.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={2200} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Интеграция аудио стала особым вызовом. Современные браузеры блокируют автовоспроизведение, поэтому нужно было элегантно обработать разрешения пользователя.
          </ScrollReveal>

          <ScrollReveal delay={2400} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Мы создали интеллектуальную систему с toast-уведомлениями, которая мягко направляет пользователя к взаимодействию с аудио.
          </ScrollReveal>

          <ScrollReveal delay={2600} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Плавающий плеер с эффектом размытия появляется только тогда, когда это действительно нужно.
          </ScrollReveal>

          <ScrollReveal delay={2800}>
            <section>
              <h2 className="mb-8 text-stone-100 text-4xl font-extrabold">Детали взаимодействия</h2>
              <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-stone-300">Плавные переходы между светлой и тёмной темами</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-stone-300">Анимации появления элементов при скролле</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-stone-300">Hover-эффекты с backdrop-blur</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-stone-300">Летающие анимации обложек</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-stone-300">Адаптивный дизайн для всех устройств</p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={3000} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Каждая деталь интерфейса была продумана до мелочей. Мы использовали современные CSS-возможности для создания эффектов, которые раньше требовали JavaScript.
          </ScrollReveal>

          <ScrollReveal delay={3200} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Система тем интегрирована на глубоком уровне — каждый элемент плавно адаптируется к выбранной пользователем схеме.
          </ScrollReveal>

          <ScrollReveal delay={3400} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Результат — интерфейс, который чувствуется естественным и отзывчивым на любом устройстве.
          </ScrollReveal>

          <ScrollReveal delay={3600}>
            <section>
              <h2 className="mb-8 text-stone-100 font-extrabold text-4xl">Производительность</h2>
              <div className="bg-stone-900/50 p-8 rounded-xl border border-stone-800">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-stone-200">Оптимизации</h3>
                    <ul className="text-stone-300 space-y-3">
                      <li>Lazy Loading изображений</li>
                      <li>Виртуализация элементов</li>
                      <li>Мемоизация React hooks</li>
                      <li>Оптимизированная сборка</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-stone-200">Результаты</h3>
                    <ul className="text-stone-300 space-y-3">
                      <li>Мгновенная загрузка</li>
                      <li>Плавная прокрутка</li>
                      <li>Стабильная работа</li>
                      <li>Низкое потребление памяти</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={3800} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            RFD MUSEUM — это больше, чем просто галерея. Это демонстрация возможностей современных веб-технологий и искусственного интеллекта.
          </ScrollReveal>

          <ScrollReveal delay={4000} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Каждый элемент здесь служит цели создания уникального пользовательского опыта. От математических алгоритмов до тонких анимаций.
          </ScrollReveal>

          <ScrollReveal delay={4200} baseOpacity={0.1} baseRotation={2} textClassName="text-stone-200 leading-relaxed mb-6 text-2xl">
            Это пример того, как ИИ может стать креативным партнёром в создании по-настоящему инновационных интерфейсов.
          </ScrollReveal>

          <ScrollReveal delay={4400}>
            <div className="text-center py-16 border-t border-stone-800">
              <p className="text-stone-400 text-lg">
                Создано с помощью Lovable AI
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default About;
