'use client';

const MainContainer = () => {
  return (
    <div>
      <video
        src="/videos/gwana_intro_2.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      {/* <video
        src="/videos/gwana_intro.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      /> */}
    </div>
  );
};

export default MainContainer;
