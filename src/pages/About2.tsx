
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WebGLApp from '../classes/WebGLApp';

const About2: React.FC = () => {
  const webglAppRef = useRef<WebGLApp | null>(null);

  useEffect(() => {
    // Initialize WebGL app after component mounts
    const timer = setTimeout(() => {
      webglAppRef.current = new WebGLApp();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (webglAppRef.current) {
        webglAppRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Canvas will be automatically added by WebGL App */}
      
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back to Gallery</span>
        </Link>
      </div>

      {/* Content */}
      <div className="content font-ys relative z-10">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          
          {/* Heading Section */}
          <section className="section__heading text-center mb-32">
            <h3 data-animation="webgl-text" className="text__2 text-2xl md:text-4xl font-medium mb-8 text-muted-foreground">
              RFD MUSEUM
            </h3>
            <h2 data-animation="webgl-text" className="text__1 text-6xl md:text-8xl lg:text-9xl font-bold leading-tight text-foreground">
              DIGITAL ARCHIVE OF SOUND
            </h2>
          </section>

          {/* Main Content */}
          <section className="section__main__content space-y-16 text-center">
            <p data-animation="webgl-text" className="text__2 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-foreground">
              RFD MUSEUM представляет собой цифровой архив звуковых экспериментов, 
              где каждая обложка альбома становится окном в уникальный звуковой мир. 
              Этот проект исследует границы между визуальным и аудиальным искусством.
            </p>
            
            <p data-animation="webgl-text" className="text__2 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-foreground">
              Коллекция включает в себя экспериментальную электронную музыку, 
              эмбиентные композиции и звуковые ландшафты, созданные с использованием 
              современных технологий синтеза и обработки звука.
            </p>
            
            <p data-animation="webgl-text" className="text__2 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-foreground">
              Каждый релиз в архиве сопровождается уникальной визуальной концепцией, 
              отражающей эстетику и настроение музыкального произведения. 
              Мы стремимся создать иммерсивный опыт, где звук и изображение дополняют друг друга.
            </p>
          </section>

          {/* Footer Section */}
          <section className="section__footer text-center mt-32">
            <p data-animation="webgl-text" className="text__3 text-4xl md:text-6xl lg:text-7xl font-black text-foreground">
              EXPLORE THE SONIC UNIVERSE
            </p>
          </section>

        </div>
      </div>

      {/* WebGL Canvas Styles */}
      <style jsx>{`
        .content {
          font-size: clamp(12px, 1.2vw, 18px);
        }
        
        .text__1 {
          max-width: 20ch;
          margin: 0 auto;
        }
        
        .text__2 {
          max-width: 50ch;
          margin: 0 auto;
          letter-spacing: 0.02em;
        }
        
        .text__3 {
          max-width: 15ch;
          margin: 0 auto;
        }

        :global(canvas) {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default About2;
