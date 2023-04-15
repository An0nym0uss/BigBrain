import styles from './GameBlock.module.css';
import { useNavigate } from 'react-router-dom';

function GameBlock(props) {

    const navigate = useNavigate();

    function toEditPage() {
        navigate(`/edit/${props.data.id}`);
    }

    return (
        <div className={styles.block} id={props.data.id}>
            {props.data.name}
            <button className={styles.editbtm} onClick={toEditPage}> Eidt </button>
        </div>
    );
}

export default GameBlock;