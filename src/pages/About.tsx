
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-ys">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <ScrollReveal>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Вернуться к галерее
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="mb-8 text-foreground font-extrabold text-4xl">О проекте RFD MUSEUM</h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-muted-foreground mb-16 leading-relaxed text-xl">Интерактивная галерея обложек RFD, созданная с помощью ИИ</p>
        </ScrollReveal>

        <div className="space-y-20">
          <ScrollReveal delay={600} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Этот проект начался с простой идеи — сделать красивую галерею для музыкальных обложек RFD. 
              Но вместо обычной разработки решили попробовать новый подход.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Всё создано с помощью Lovable AI — просто описывали на русском языке что хотим, 
              а ИИ сразу писал код и показывал результат.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Получилась интерактивная галерея, где можно листать обложки, слушать музыку 
              и переключаться между светлой и тёмной темами.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <section>
              <h2 className="text-3xl mb-8 text-foreground font-bold">Что использовали</h2>
              <div className="bg-card p-8 border border-border rounded-3xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Основа</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>React + TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Vite</li>
                      <li>React Router</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 text-foreground">Дополнительно</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Shadcn/ui компоненты</li>
                      <li>Lucide иконки</li>
                      <li>Переключение тем</li>
                      <li>Аудио плеер</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1000} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Самая сложная часть — показать много обложек одновременно без тормозов. 
              Сделали виртуализацию: показываем только те картинки, которые видны на экране.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Для красивого размещения обложек используется алгоритм, который расставляет их 
              естественно, но не случайно — каждый раз в одних и тех же местах.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Картинки загружаются быстро и плавно появляются без всяких серых плейсхолдеров.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1200}>
            <section>
              <h2 className="text-3xl mb-8 text-foreground font-bold">Как это работает</h2>
              <div className="space-y-6">
                <div className="bg-card p-6 border border-border rounded-2xl">
                  <h3 className="text-lg font-medium mb-3 text-foreground">Виртуализация</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Показываем только видимые обложки. Остальные создаются и удаляются при прокрутке. 
                    Поэтому можно листать тысячи картинок без зависаний.
                  </p>
                </div>
                <div className="bg-card p-6 border border-border rounded-2xl">
                  <h3 className="text-lg font-medium mb-3 text-foreground">Умное размещение</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Алгоритм расставляет обложки так, чтобы они не налезали друг на друга, 
                    но выглядели естественно. Каждая имеет своё место.
                  </p>
                </div>
                <div className="bg-card p-6 border border-border rounded-2xl">
                  <h3 className="text-lg font-medium mb-3 text-foreground">Быстрая загрузка</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Картинки появляются сразу и плавно. Никаких серых квадратиков и долгих ожиданий.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1400} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              С аудио было интереснее — браузеры не разрешают автопроигрывание. 
              Поэтому сделали умные уведомления, которые помогают включить звук.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Плеер появляется только когда нужен, не мешается и выглядит аккуратно.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1600}>
            <section>
              <h2 className="mb-8 text-foreground font-bold text-3xl">Что получилось</h2>
              <div className="bg-card p-6 border border-border rounded-2xl">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Быстрая загрузка и плавная прокрутка</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Переключение между светлой и тёмной темой</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Встроенный аудиоплеер</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Работает на всех устройствах</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Красивые анимации и эффекты</p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1800} stagger={true}>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Весь интерфейс продуман до мелочей. Используем современные возможности CSS 
              для эффектов, которые раньше требовали сложного JavaScript.
            </p>
            <p className="text-foreground leading-relaxed mb-6 text-xl">
              Темы работают везде — каждый элемент плавно меняется при переключении.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2000}>
            <section>
              <h2 className="mb-8 text-foreground font-bold text-3xl">Результат</h2>
              <div className="bg-card p-6 border border-border rounded-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-foreground">Производительность</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Мгновенная загрузка</li>
                      <li>Плавная прокрутка</li>
                      <li>Низкое потребление памяти</li>
                      <li>Стабильная работа</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-foreground">Удобство</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Простое управление</li>
                      <li>Адаптивный дизайн</li>
                      <li>Красивые переходы</li>
                      <li>Интуитивный интерфейс</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={2200}>
            <p className="text-foreground leading-relaxed mb-6 text-xl text-center">
              RFD MUSEUM — простая галерея, созданная с помощью ИИ за несколько часов диалога.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={2400}>
            <div className="text-center py-12 border-t border-border">
              <div className="mb-6">
                <img src="/lovable-uploads/0a7fd895-cc6a-4687-bdd6-32846b9cd638.png" alt="AntoshkinBaskirov" className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-medium text-foreground">AntoshkinBashkirov</h3>
              </div>
              <p className="text-muted-foreground">
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
