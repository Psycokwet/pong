export default interface Message {
  id: number;
  author: string,
  time: Date,
  content: string,
  roomId: number,
}