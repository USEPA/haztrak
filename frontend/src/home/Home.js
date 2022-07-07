import {useDispatch, useSelector} from 'react-redux';
import {Button} from "react-bootstrap";

export {Home};

function Home() {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const {on} = useSelector(state => state.my)

  return (
    <div>
      <h1>Hi {user}!</h1>
      <Button className={`btn ${on ? 'btn-primary' : 'btn-success'} `}
              onClick={() => dispatch({type: 'mySlice/toggleOn'})}>
        turn {on ? 'off' : 'on'}
      </Button>
    </div>
  );
}
