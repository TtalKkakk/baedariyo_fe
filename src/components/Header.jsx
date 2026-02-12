export default function Header() {
  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>배달이요</h1>
    </header>
  );
}

const headerStyle = {
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  background: 'white',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const titleStyle = {
  fontSize: 18,
  fontWeight: 800,
};
