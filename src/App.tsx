import { useState, useEffect } from "react";

interface Message {
  title: string;
  role: string;
  content: string;
}

const App = () => {
  const [message, setMessage] = useState<Message | null>(null);
  const [value, setValue] = useState("");
  const [previousChats, setPreviousChats] = useState<Message[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle: string) => {
    setMessage(null);
    setValue("");
    setCurrentTitle(uniqueTitle);
  };

  const getMessages = async () => {
    try {
      const response = await fetch("http://localhost:8000/completions", {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => {
        return [
          ...prevChats,
          { title: currentTitle, role: "user", content: value },
          { title: currentTitle, role: message.role, content: message.content },
        ];
      });
    }
  }, [message, currentTitle]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by aw</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>awGPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              Go
            </div>
          </div>
          <p className="info">whatever</p>
        </div>
      </section>
    </div>
  );
};

export default App;
