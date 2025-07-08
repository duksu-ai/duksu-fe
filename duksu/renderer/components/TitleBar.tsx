export default function TitleBar() {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-8 z-50 bg-transparent"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    />
  );
}