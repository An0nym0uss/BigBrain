import styles from './QuesBlock.module.css';
import { useNavigate } from 'react-router-dom';

function QuesBlock(props) {

    // const navigate = useNavigate();

    // function toEditPage() {
    //     navigate(`/edit/${props.data.id}`);
    // }

    return (
        <div className={styles.block}>
            {props.data.question}
            <br />
            {props.data.type} choice
            <button className={styles.editbtm}> Eidt </button>
            <button className={styles.delbtm}> Delete </button>
        </div>
    );
}

export default QuesBlock;