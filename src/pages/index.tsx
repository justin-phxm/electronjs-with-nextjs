// import { User } from "@/interfaces";
import { useEffect } from "react";

export default function Home() {
  // const [user, setUser] = useState<User | null>(null);
  // const addUser = async () => {
  //   const response = await window.api.addUser("world");
  //   if (!response) {
  //     alert("Error adding user!");
  //     return;
  //   }
  //   setUser(response);
  // };
  const getMessage = async () => {
    const myVal = await window.api.addNumbers(5, 10);
    console.log(myVal);
  };
  const getMessage1 = async () => {
    const myVal = await window.api.subNumbers(10, 5);
    console.log(myVal);
  };
  useEffect(() => {
    getMessage();
    getMessage1();
  }, []);
  return (
    <main>
      <div className="container">
        <h1>Welcome 👋</h1>
        <p>Add a new user to the system.</p>
        {/* <button onClick={addUser}>Add User</button> */}

        {/* {user && (
          <div className="user-card">
            <h2>User Added:</h2>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Created at:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last update:</strong>{" "}
              {new Date(user.updateTimestamp).toLocaleString()}
            </p>
          </div>
        )} */}
        {/* <button onClick={getUsers} style={{ marginTop: "20px" }}>
          Get Users
        </button>
        {users && users.length > 0 && (
          <div className="user-card">
            <h2>Users:</h2>
            {users.map((user, index) => (
              <div key={index}>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Created at:</strong>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Last update:</strong>{" "}
                  {new Date(user.updateTimestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )} */}

        {/* <button onClick={readSomething} style={{ marginTop: "20px" }}>
          Read Balance Points
        </button>
        {balancePoints && balancePoints.length > 0 && (
          <div className="user-card">
            <h2>Balance Points:</h2>
            {balancePoints.map((point, index) => (
              <div key={index}>
                <p>
                  <strong>Weather Zone:</strong> {point.weatherZone || "N/A"}
                </p>
                <p>
                  <strong>Balance Point:</strong> {point.balancePoint || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )} */}
      </div>

      <style jsx>{`
        main {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          font-family: "Segoe UI", sans-serif;
        }

        .container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
          width: 100%;
          max-width: 500px;
        }

        h1 {
          margin-bottom: 12px;
          color: #333;
        }

        p {
          margin-bottom: 24px;
          color: #666;
        }

        button {
          background-color: #667eea;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #5a67d8;
        }

        .user-card {
          margin-top: 30px;
          text-align: left;
          background-color: #f7fafc;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .user-card h2 {
          margin-bottom: 12px;
          color: #2d3748;
        }

        .user-card p {
          margin: 6px 0;
          color: #4a5568;
        }
      `}</style>
    </main>
  );
}
