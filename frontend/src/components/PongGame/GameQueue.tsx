import Position from "/shared/interfaces/Position";
const GameQueue = ({
  canvasSize,
}:
{
  canvasSize: Position,
}) => {

  return <div>
  <div className="w-full h-7/8">
    {/* i didn't know ths size of the text as they are on all pages so the font-color is black... */}
    {/* and black on black... */}
    <div><h1 className="text-black text-3xl text-center p-2">RANKED MATCH</h1></div>
    <div><h2 className="text-black lg:text-3xl text-center p-2">First to 10 points win</h2></div>
    <div className="grid sm:grid-cols-5 content-center sm:flex sm:justify-around">
      <div className="flex self-center">
        <div
          // i add twice border because of tailwind border
          style={{width: canvasSize.x + 16, height: canvasSize.y + 8}}
          className="border-x-8 border-y-4 border-white rounded-lg flex flex-col place-content-around"
        >
          <img
          style={{ width: 'auto' }}
            className="place-self-center sm:h-full h-3/5"
            src={'/public/aniek-janssen-loading-icon-export.gif'}
          />
          <h1 className="sm:text-3xl text-center p-8"><b>Looking for an opponent</b></h1>
        </div>
      </div>
      <div className="sm:hidden block grid grid-cols-2 content-between w-full">
      </div>
    </div>
  </div>
</div>
} 

export default GameQueue;