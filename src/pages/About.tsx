import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-ys">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <ScrollReveal>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к галерее
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="text-5xl mb-8 text-foreground font-extrabold">
            История создания RFD MUSEUM
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-muted-foreground mb-16 leading-relaxed text-xl">
            Рассказ о том, как интерактивная галерея музыкальных обложек была создана с помощью искусственного интеллекта
          </p>
        </ScrollReveal>

        <div className="space-y-20">
          <ScrollReveal delay={600} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Всё началось с простой идеи — создать интерактивную галерею для музыкальных обложек. 
              Но вместо традиционной разработки, мы решили попробовать что-то революционное.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Lovable AI стал нашим партнёром в этом проекте. Через естественный диалог на русском языке 
              мы описывали желаемые функции, а ИИ мгновенно воплощал их в код.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Каждая строчка кода, каждая анимация, каждый компонент — всё создавалось в реальном времени через простые инструкции.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <section>
              <h2 className="text-3xl font-semibold mb-8 text-foreground">Технологический фундамент</h2>
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Основа</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>React 18 с TypeScript</li>
                      <li>Vite для быстрой сборки</li>
                      <li>Tailwind CSS для стилизации</li>
                      <li>Shadcn/ui компоненты</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Расширения</h3>
                    <ul className="text-muted-foreground space-y-2">
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

          <ScrollReveal delay={1000} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Самой сложной частью стала реализация бесконечного канваса. Нужно было показать все обложки одновременно, но без потери производительности.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Lovable AI предложил виртуализацию. Система отображает только те элементы, которые видны пользователю в данный момент.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Для естественного размещения элементов мы использовали алгоритм Poisson Disk Sampling — 
              математическую модель, которая создаёт органичное, но структурированное расположение.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1200}>
            <section>
              <h2 className="mb-8 text-foreground text-5xl font-extrabold">Уникальные решения</h2>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-medium mb-3 text-foreground">Виртуализация бесконечного канваса</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Система отображает только видимые элементы, позволяя показывать тысячи обложек 
                    без потери производительности. Элементы динамически создаются и удаляются 
                    при прокрутке.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-medium mb-3 text-foreground">Алгоритм Poisson Disk Sampling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Математический алгоритм для создания естественного размещения элементов 
                    с минимальным расстоянием между ними. Каждая обложка имеет своё уникальное 
                    место в пространстве.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-medium mb-3 text-foreground">Детерминированная рандомизация</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Позиции и анимации генерируются псевдослучайно, но остаются стабильными 
                    между перезагрузками. Каждый пользователь видит одну и ту же композицию.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1400} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Интеграция аудио стала особым вызовом. Современные браузеры блокируют автовоспроизведение, поэтому нужно было как-то обработать разрешения пользователя.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Мы создали интеллектуальную систему с toast-уведомлениями, которая направляет пользователя к взаимодействию с аудио.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Плавающий плеер с эффектом размытия появляется только тогда, когда это действительно нужно.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1600}>
            <section>
              <h2 className="mb-8 text-foreground text-5xl font-extrabold">Детали взаимодействия</h2>
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Плавные переходы между светлой и тёмной темами</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Анимации появления элементов при скролле</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Hover-эффекты с backdrop-blur</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Летающие анимации обложек</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Адаптивный дизайн для всех устройств</p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1800} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Каждая деталь интерфейса была продумана до мелочей. Мы использовали современные 
              CSS-возможности для создания эффектов, которые раньше требовали JavaScript.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Система тем интегрирована на глубоком уровне — каждый элемент плавно адаптируется 
              к выбранной пользователем схеме.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              Результат — интерфейс, который чувствуется естественным и отзывчивым на любом устройстве.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2000}>
            <section>
              <h2 className="mb-8 text-foreground font-extrabold text-5xl">Производительность</h2>
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Оптимизации</h3>
                    <ul className="text-muted-foreground space-y-3">
                      <li>Lazy Loading изображений</li>
                      <li>Виртуализация элементов</li>
                      <li>Мемоизация React hooks</li>
                      <li>Оптимизированная сборка</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Результаты</h3>
                    <ul className="text-muted-foreground space-y-3">
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

          <ScrollReveal delay={2200} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-3xl font-extrabold">
              RFD MUSEUM — это больше, чем просто галерея. Это демонстрация возможностей 
              современных веб-технологий и искусственного интеллекта.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2400}>
            <div className="text-center py-16 border-t border-border">
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/0a7fd895-cc6a-4687-bdd6-32846b9cd638.png" 
                  alt="AntoshkinBaskirov" 
                  className="w-auto h-16 rounded-full mx-auto mb-6 object-cover" 
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">AntoshkinBashkirov</h3>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">
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
