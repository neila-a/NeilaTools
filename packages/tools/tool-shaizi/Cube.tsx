import {
    useFrame
} from "@react-three/fiber";
import {
    useRef
} from "react";
import {
    BoxGeometry,
    Camera,
    Mesh,
    MeshPhongMaterial,
    TextureLoader
} from "three";
import img1 from "./image/1.svg";
import img2 from "./image/2.svg";
import img3 from "./image/3.svg";
import img4 from "./image/4.svg";
import img5 from "./image/5.svg";
import img6 from "./image/6.svg";
import {
    StaticImageData
} from "next/image";
import {
    rotateAxis,
    rotateStep,
    randomAxis
} from "./shaiziCanvas";
export default function Cube(props: {
    cishu: number;
}) {
    const camera = useRef<Camera>(),
        mesh = useRef<Mesh>(),
        stage = useRef<rotateAxis[]>([]),
        cacheStage = useRef<rotateAxis[]>([]),
        cishu = useRef<number>(0),
        materials = [img1, img2, img3, img4, img5, img6].map((img: StaticImageData) => new MeshPhongMaterial({
            map: new TextureLoader().load(img.src),
            color: 16777215
        })),
        cube = new BoxGeometry(3, 3, 3);
    useFrame(() => {
        if (stage.current.length !== 0 && cishu.current < rotateStep / 2) {
            mesh.current.rotation[stage.current[stage.current.length - 1]] += Math.PI / rotateStep;
            cishu.current = cishu.current + 1;
        } else {
            cishu.current = 0;
            const oldStage = stage.current.slice(0);
            oldStage.pop();
            stage.current = oldStage;
        }
    });
    return (
        <>
            <camera ref={camera} position={[10, 10, 10]} />
            <mesh ref={mesh} args={[cube, materials]} onClick={event => {
                if (stage.current.length === 0) {
                    const oldStage = [];
                    while (oldStage.toString() === cacheStage.current.toString()) for (let step = 0; step < props.cishu; step++) {
                        oldStage.push(randomAxis());
                    }
                    if (oldStage.toString() === cacheStage.current.toString()) {
                        oldStage.splice(0, oldStage.length);
                        for (let step = 0; step < props.cishu; step++) {
                            oldStage.push(randomAxis());
                        }
                    } else {
                        cacheStage.current = oldStage;
                    }
                    stage.current = oldStage;
                }
            }}>
            </mesh>
        </>
    );
}
