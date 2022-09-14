import Cookies from 'js-cookie';

export const DisconnectionButton = () => {

  const handleClick = () => {
    Cookies.remove('jwt')
    window.location.reload();
  }

  return (
    <div>
      <button onClick={handleClick}>
        Signout
      </button>
    </div>
  );
}