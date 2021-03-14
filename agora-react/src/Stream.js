import { useEffect } from 'react';
import { useParams } from 'react-router';

function Stream({
  createStream,
  watchStream,
  leaveStream,
  terminateStream,
  audiences,
}) {
  const { channel } = useParams();

  useEffect(() => {
    createStream(channel);
    watchStream();
  }, [createStream, watchStream, channel]);

  return (
    <div className='App'>
      <h1>HOST:</h1>
      <button onClick={terminateStream}>Terminate</button>
      <div id='host' style={{ height: '500px', width: '800px' }}></div>
      <div id='audience'>
        {audiences
          ? audiences.map((audience) => (
              <div
                key={audience}
                style={{
                  width: '350px',
                  height: '250px',
                }}
              >
                <div
                  id={audience}
                  style={{
                    width: '320px',
                    height: '240px',
                  }}
                ></div>
                <button onClick={leaveStream}>Leave</button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default Stream;
