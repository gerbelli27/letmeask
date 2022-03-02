import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { getDatabase, set, ref, child, push } from "firebase/database";
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';


import '../styles/room.css';


type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');


  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('you must be logged in')
    }

    const db = getDatabase();
    const newKeyQuestion = push(child(ref(db), 'rooms/')).key;
    set(ref(db, '/rooms/' + roomId + '/questions/' + newKeyQuestion), {
      content: newQuestion,
      author: {
        name: user!.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    });
    
   setNewQuestion('')
   // navigate(`/rooms/${roomRef}`);

  }



  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask logo" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className="main">
        <div className="room-title" >
          <h1>Room name</h1>
          <span>4 questions</span>
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="Ask a question."
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer" >
          { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span className="username">{user.name}</span>
              </div>
            ) : ( <span className="username1"><a className="log-in">Log in</a>to ask questions</span>)}
            <button className="btn"type="submit" disabled={!user} >Send question</button>
          </div>
        </form>
      </main>

    </div>


  )
}