import { Link } from 'react-router-dom';

function Home({ channelName, setChannelName, channels, setChannels }) {
  return (
    <div className='App'>
      <input type='text' onChange={(e) => setChannelName(e.target.value)} />
      <button
        onClick={() => {
          setChannels([...channels, channelName]);
        }}
      >
        Create
      </button>

      {channels &&
        channels.map((channel, index) => (
          <div>
            {' '}
            <Link key={index} to={`/${channel}`}>
              {channel}
            </Link>
          </div>
        ))}
    </div>
  );
}

export default Home;
