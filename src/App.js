import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  // Objeto produto
  const produto = {
    codigo: 0,
    nome: '',
    marca: ''
  }

  // UseState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  // Useffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
      .then(retorno => retorno.json())
      .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  // Obtendo os dados do formulário
  const aoDigitar = (e) => {
    setObjProduto({ ...objProduto, [e.target.name]: e.target.value });
  }

  // Cadastrar produto
  const cadastrar = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!objProduto.nome || !objProduto.marca) {
      alert('Por favor, preencha todos os campos!');
      return; // Não faz a requisição se algum campo estiver vazio
    }

    fetch('http://localhost:8080/cadastrar', {
      method: 'POST',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((retorno) => retorno.json())
      .then((retorno_convertido) => {
        // Verifica se a resposta contém uma mensagem de erro
        if (retorno_convertido.mensagem) {
          alert(retorno_convertido.mensagem);
        } else {
          setProdutos((prevProdutos) => [...prevProdutos, retorno_convertido]);
          alert('Produto cadastrado com sucesso!');
          limparFormulario()
        }
      })
      .catch((error) => {
        console.error('Erro ao cadastrar produto:', error);
        alert('Houve um erro ao cadastrar o produto.');
      });
  };

  // Limpar formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  // Selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }


  // Retorno
  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} cancelar={limparFormulario} />
      <Tabela vetor={produtos} selecionar={selecionarProduto} />
    </div>
  );
}

export default App;
