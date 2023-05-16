import axios from "axios";
import { useEffect, useState } from "react";
import "./Products.css";
import Container from "../../components/Container/Container";
import CSVReader from "react-csv-reader";
import Button from "../../components/Button/Button";
import {
  BsFiletypeCsv,
  BsCheckLg,
  BsShieldFillCheck,
  BsXCircleFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import { TbReload } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [alteracoes, setAlteracoes] = useState();
  const [liberaValidacao, setLiberaValidacao] = useState(false);
  const [validado, setValidado] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [erro, setErro] = useState([]);
  const [habilitaEnvio, setHabilitaEnvio] = useState(false);
  const [registrosValidados, setRegistrosValidados] = useState([]);

  const validacao = () => {
    const alterados = products.filter((produto) => {
      return produto.new_price ? true : false;
    });
    const validadorGeral = [];
    alterados.forEach((alterado) => {
      let regras = [false, false];
      if (alterado.new_price >= alterado.cost_price) {
        regras[0] = true;
      }
      if (
        alterado.new_price <= alterado.sales_price * 1.1 &&
        alterado.new_price >= alterado.sales_price * 0.9
      ) {
        regras[1] = true;
      }
      validadorGeral.push(regras[0], regras[1]);

      alterado.regra = regras;
    });

    if (validadorGeral.includes(false)) {
      setValidado(false);
      showToastMessageAttention("Verifique as alterações!");
    } else {
      setValidado(true);
      showToastMessage("Informações validadas!");
    }
    setRegistrosValidados((prevState) => [
      ...prevState,
      ...alterados.map(({ code, new_price }) => ({ code, new_price })),
    ]);

    setAlteracoes(alterados);
  };

  const openModal = (item, codProd) => {
    const msg = [
      `O novo valor do produto ${codProd} é menor que o preço de custo.`,
      `O novo valor do produto ${codProd} não obedece a margem de 10% permitida.`,
      `O novo valor do produto ${codProd} foi validado.`,
    ];
    const erros = [];
    if (!item[0]) {
      erros.push(msg[0]);
    }
    if (!item[1]) {
      erros.push(msg[1]);
    }
    if (item[0] && item[1]) {
      erros.push(msg[2]);
    }
    setErro(erros);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const showToastMessage = (msg) => {
    toast.success(`${msg}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageAttention = (msg) => {
    toast.warn(`${msg}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageError = (msg) => {
    toast.error(`${msg}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleCSVUpload = (data) => {
    setAlteracoes();
    const novoArray = products.map((produto) => {
      const codigo = produto.code;
      const novoPreco = data.find(
        (info) => parseInt(info[0]) === parseInt(codigo)
      );
      if (novoPreco) {
        return { ...produto, new_price: parseFloat(novoPreco[1], 10) };
      } else {
        return produto;
      }
    });
    setLiberaValidacao(true);
    setProducts(novoArray);
    showToastMessage("Arquivo enviado. Realize a validação!");
    setHabilitaEnvio(true);
  };

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8800/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      showToastMessageError("err");
    }
  };

  const handleSubmit = async () => {
    await axios
      .put("http://localhost:8800/products/atualizar", registrosValidados)
      .then(({ data }) => {
        showToastMessage(data);
        window.location.reload();
      })
      .catch(({ data }) => showToastMessageError(data));
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <h1 className="title">Validador</h1>
      {alteracoes ? (
        <table>
          <thead>
            <tr>
              <th>Cód.</th>
              <th>Descrição</th>
              <th>Custo</th>
              <th>P. de venda</th>
              <th>Novo preço</th>
              <th>Regras</th>
            </tr>
          </thead>
          <tbody>
            {alteracoes.map((product) => {
              return (
                <tr
                  key={product.code}
                  className={
                    product.regra[0]
                      ? product.regra[1]
                        ? "product aprovado"
                        : "product reprovado"
                      : "product reprovado"
                  }
                >
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.cost_price}</td>
                  <td>{product.sales_price}</td>
                  <td>{product.new_price}</td>
                  <td
                    className="heartbeat"
                    onClick={() => openModal(product.regra, product.code)}
                  >
                    {product.regra[0] ? (
                      product.regra[1] ? (
                        <BsFillCheckCircleFill />
                      ) : (
                        <BsXCircleFill />
                      )
                    ) : (
                      <BsXCircleFill />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Envie um arquivo para validação</p>
      )}
      <div className="btns">
        <CSVReader
          disabled={habilitaEnvio}
          onFileLoaded={handleCSVUpload}
          inputId="csv-input"
          onError={showToastMessageError}
          accept=".csv"
        />
        <Button funcao={validacao} disabled={!liberaValidacao}>
          <BsCheckLg />
          Validar
        </Button>
        <Button disabled={!validado} funcao={handleSubmit}>
          <BsShieldFillCheck />
          Atualizar
        </Button>
        <Button funcao={() => window.location.reload()}>
          <TbReload />
          Limpar
        </Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Relatorio"
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        {erro.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default Products;
