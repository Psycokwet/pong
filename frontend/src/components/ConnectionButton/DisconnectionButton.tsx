type DisconnectionButtonProps = {
  setConnected: CallableFunction;
};

export const DisconnectionButton = ({ setConnected }: DisconnectionButtonProps) => {

  const handleClick = () => {
    setConnected(false)
    window.location.replace("http://localhost:8080/api/auth/42/logout");
  }

  return (
    <div>
      <button onClick={handleClick}>
        Signout
      </button>
    </div>
  );
}