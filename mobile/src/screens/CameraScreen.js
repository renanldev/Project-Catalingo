import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

// Troque pelo IPv4 do seu PC (o mesmo do teste no Safari)
const API_URL = "http://192.168.1.52:8000";
const TIMEOUT_MS = 60000;

const NOMES_MATERIAL = {
  Lata: "Lata",
  Tampa: "Tampa",
  "plastic-bottles": "Garrafa plástica",
};

const NOMES_ESTADO = {
  sana: "Em bom estado",
  danada: "Amassada ou danificada",
  defectuosa: "Defeituosa",
};

async function detectar(imagemBase64) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TIMEOUT_MS);

  try {
    const resposta = await fetch(`${API_URL}/detectar-base64`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagem_base64: imagemBase64 }),
      signal: controle.signal,
    });
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      throw new Error(dados.detail || `Erro ${resposta.status}`);
    }
    return dados;
  } catch (erro) {
    if (erro.name === "AbortError") {
      throw new Error("A detecção demorou demais. Tente de novo.");
    }
    if (erro instanceof TypeError) {
      throw new Error(
        "Não consegui falar com o servidor. Confira o Wi-Fi, o IP no App.js e se o backend está rodando."
      );
    }
    throw erro;
  } finally {
    clearTimeout(timer);
  }
}

export default function App() {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function tirarFoto() {
    if (!cameraRef.current || carregando) return;
    setCarregando(true);
    setErro(null);
    try {
      const imagem = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
      setFoto(imagem.uri);
      setResultado(await detectar(imagem.base64));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  function recomecar() {
    setFoto(null);
    setResultado(null);
    setErro(null);
  }

  // 1) Ainda carregando o estado da permissão
  if (!permissao) return <View style={estilos.tela} />;

  // 2) Sem permissão da câmera
  if (!permissao.granted) {
    return (
      <View style={[estilos.tela, estilos.centro]}>
        <Text style={estilos.texto}>Preciso da câmera para identificar o lixo.</Text>
        <Pressable style={estilos.botao} onPress={pedirPermissao}>
          <Text style={estilos.textoBotao}>Permitir câmera</Text>
        </Pressable>
      </View>
    );
  }

  // 3) Já tem foto: mostra o resultado
  if (foto) {
    const material = resultado?.material;
    const estado = resultado?.estado;
    return (
      <View style={estilos.tela}>
        <Image source={{ uri: foto }} style={estilos.foto} resizeMode="contain" />

        {carregando && (
          <View style={estilos.carregando}>
            <ActivityIndicator size="large" />
            <Text style={estilos.texto}>Analisando...</Text>
          </View>
        )}

        {erro && <Text style={estilos.erro}>{erro}</Text>}

        {resultado && (
          <View style={estilos.cartao}>
            <Text style={estilos.titulo}>
              {material
                ? NOMES_MATERIAL[material.nome] ?? material.nome
                : "Não identifiquei o objeto"}
            </Text>
            {estado && (
              <Text style={estilos.texto}>
                {NOMES_ESTADO[estado.nome] ?? estado.nome}
              </Text>
            )}
            {material && (
              <Text style={estilos.pequeno}>
                Confiança: {Math.round(material.confianca * 100)}%
              </Text>
            )}
            {!resultado.confiavel && (
              <Text style={estilos.aviso}>
                Não tenho certeza. Tente outra foto, com boa luz e o objeto bem enquadrado.
              </Text>
            )}
          </View>
        )}

        {!carregando && (
          <Pressable style={estilos.botao} onPress={recomecar}>
            <Text style={estilos.textoBotao}>Nova foto</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // 4) Câmera ao vivo
  return (
    <View style={estilos.tela}>
      <CameraView ref={cameraRef} style={estilos.camera} facing="back" />
      <View style={estilos.barra}>
        <Pressable style={estilos.disparo} onPress={tirarFoto} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  centro: { alignItems: "center", justifyContent: "center", padding: 24 },
  camera: { flex: 1, marginHorizontal: 12, borderRadius: 24, overflow: "hidden" },
  barra: { height: 130, alignItems: "center", justifyContent: "center" },
  disparo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    borderWidth: 6,
    borderColor: "#2e7d32",
  },
  foto: { flex: 1, marginHorizontal: 12, borderRadius: 24 },
  carregando: { alignItems: "center", padding: 16, gap: 8 },
  cartao: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f1f8e9",
    gap: 4,
  },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#1b5e20" },
  texto: { fontSize: 18, color: "#222", textAlign: "center" },
  pequeno: { fontSize: 14, color: "#555" },
  aviso: { fontSize: 14, color: "#b26a00", marginTop: 8 },
  erro: { color: "#c62828", fontSize: 16, textAlign: "center", padding: 16 },
  botao: {
    backgroundColor: "#2e7d32",
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});