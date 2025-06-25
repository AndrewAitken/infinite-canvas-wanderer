
import InfiniteCanvas from "@/components/InfiniteCanvas";
import Header from "@/components/Header";
import { useLoadingSequence } from "@/hooks/useLoadingSequence";

const Index = () => {
  const { isLogoInCenter, isLogoMoving, shouldShowAlbums } = useLoadingSequence();

  return (
    <div className="relative">
      <Header 
        isLogoInCenter={isLogoInCenter}
        isLogoMoving={isLogoMoving}
      />
      <InfiniteCanvas shouldShowAlbums={shouldShowAlbums} />
    </div>
  );
};

export default Index;
