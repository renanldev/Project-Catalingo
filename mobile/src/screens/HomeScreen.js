import React from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, Platform } from 'react-native';

// --- PALETA SOFT ARCADE / CARTOON ---
const CORES = {
  fundo: '#F8FAFC',        // Fundo azul/cinza clarinho (descansa a vista)
  card: '#FFFFFF',         // Branco puro para os cartões
  borda: '#1E293B',        // Azul Marinho Escuro (substitui o preto agressivo)
  textoForte: '#0F172A',   // Azul quase preto para os textos
  primaria: '#F43F5E',     // Rosa Melancia vibrante (Ação)
  primariaSombra: '#BE123C',// Sombra do botão para o efeito 3D
  xp: '#8B5CF6',           // Roxo Gamer
  fogo: '#F59E0B',         // Laranja quente
  verdeXP: '#10B981',      // Verde vibrante para a barra de progresso
};

export default function HomeScreen({ aoIrParaCamera }) {
  return (
    <SafeAreaView style={estilos.safeArea}>
      
      {/* Elementos Criativos de Fundo Suavizados (Blobs Cartoon) */}
      <View style={[estilos.formaFundo, estilos.blob1]} />
      <View style={[estilos.formaFundo, estilos.blob2]} />
      <View style={[estilos.formaFundo, estilos.blob3]} />

      <View style={estilos.container}>
        
        {/* -- HEADER ARCADE -- */}
        <View style={estilos.headerGamificacao}>
          <View style={[estilos.badge, { backgroundColor: '#EDE9FE' }]}>
            <Text style={[estilos.badgeTexto, { color: CORES.xp }]}>⚡ 120 XP</Text>
          </View>
          
          <View style={[estilos.badge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[estilos.badgeTexto, { color: CORES.fogo }]}>🔥 3 dias</Text>
          </View>
        </View>

        {/* -- CENTRO: O BICHINHO -- */}
        <View style={estilos.conteudoCentral}>
          
          {/* Caixa de Avatar Inclinada (Vibe Jogo Indie) */}
          <View style={estilos.blocoAvatar}>
            <View style={estilos.caixaAvatar}>
              <Text style={estilos.avatar}>👾</Text>
            </View>
          </View>

          <View style={estilos.infoBicho}>
            <Text style={estilos.nomeBicho}>Pixelzinho</Text>
            <View style={estilos.tagHumor}>
              <Text style={estilos.textoHumor}>BARRIGA RONCANDO 🍔</Text>
            </View>
          </View>

          {/* Balão de Fala 3D */}
          <View style={estilos.balaoFala}>
            <Text style={estilos.falaBicho}>
              "Humano, a barriga tá roncando! Escaneia uma latinha pra mim, vai?"
            </Text>
            <View style={estilos.trianguloBalao} />
          </View>

          {/* Card de Evolução */}
          <View style={estilos.cardProgresso}>
            <View style={estilos.headerProgresso}>
              <Text style={estilos.tituloProgresso}>Próxima Evolução</Text>
              <Text style={estilos.textoProgresso}>120 / 250 XP</Text>
            </View>
            <View style={estilos.barraExterna}>
              <View style={estilos.barraInterna} />
            </View>
          </View>

        </View>

        {/* -- BOTÃO PRINCIPAL 3D (O grande diferencial de UI Gamificada) -- */}
        <Pressable 
          style={({ pressed }) => [
            estilos.botaoAcao,
            pressed && estilos.botaoPressionado
          ]} 
          onPress={aoIrParaCamera}
        >
          <Text style={estilos.textoBotao}>📸 ESCANEAR LIXO</Text>
        </Pressable>
        
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  // Formas flutuantes coloridas e translúcidas
  formaFundo: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: 'rgba(30, 41, 59, 0.15)', // Borda super sutil
    opacity: 0.8,
  },
  blob1: { width: 160, height: 160, borderRadius: 80, top: -40, left: -60, backgroundColor: '#BAE6FD' }, // Azul bebê
  blob2: { width: 100, height: 100, borderRadius: 30, transform: [{ rotate: '15deg' }], top: '35%', right: -30, backgroundColor: '#FDE047' }, // Amarelinho
  blob3: { width: 220, height: 220, borderRadius: 110, bottom: -60, left: -100, backgroundColor: '#DDD6FE' }, // Lilás suave

  container: { 
    flex: 1, 
    justifyContent: 'space-between',
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 24,
  },
  
  // -- HEADER --
  headerGamificacao: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 14, 
    borderWidth: 2.5,
    borderColor: CORES.borda,
    borderBottomWidth: 5, // 3D Flat suave
  },
  badgeTexto: { 
    fontWeight: '900', 
    fontSize: 16,
    letterSpacing: 0.5,
  },
  
  // -- CENTRO (BICHINHO) --
  conteudoCentral: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 20, 
  },
  blocoAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  caixaAvatar: {
    backgroundColor: CORES.card,
    borderWidth: 3,
    borderColor: CORES.borda,
    borderRadius: 36,
    padding: 24,
    borderBottomWidth: 8,
    transform: [{ rotate: '-4deg' }], // Inclinação divertida, mas não exagerada
  },
  avatar: { fontSize: 90 },
  
  infoBicho: {
    alignItems: 'center',
    gap: 6,
  },
  nomeBicho: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: CORES.textoForte,
  },
  tagHumor: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: CORES.borda,
  },
  textoHumor: { 
    fontSize: 12, 
    color: CORES.primaria, 
    fontWeight: '900',
    letterSpacing: 0.5, 
  },
  
  // -- BALÃO DE FALA --
  balaoFala: { 
    backgroundColor: CORES.card, 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 3, 
    borderColor: CORES.borda, 
    borderBottomWidth: 6,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
  },
  falaBicho: { 
    fontSize: 16, 
    color: CORES.textoForte, 
    textAlign: 'center', 
    lineHeight: 24,
    fontWeight: '700'
  },
  trianguloBalao: {
    position: 'absolute',
    top: -12,
    width: 20,
    height: 20,
    backgroundColor: CORES.card,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: CORES.borda,
    transform: [{ rotate: '45deg' }],
  },

  // -- CARD DE PROGRESSO --
  cardProgresso: {
    backgroundColor: CORES.card,
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: CORES.borda,
    borderBottomWidth: 6,
  },
  headerProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  tituloProgresso: { fontSize: 16, fontWeight: '900', color: CORES.textoForte },
  textoProgresso: { fontSize: 16, fontWeight: '900', color: CORES.verdeXP },
  barraExterna: {
    height: 18,
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
    borderWidth: 2,
    borderColor: CORES.borda,
    overflow: 'hidden',
  },
  barraInterna: {
    width: '48%',
    height: '100%',
    backgroundColor: CORES.verdeXP,
    borderRightWidth: 2,
    borderColor: CORES.borda,
  },

  // -- BOTÃO PRINCIPAL (ESTILO FLIPERAMA) --
  botaoAcao: { 
    backgroundColor: CORES.primaria, 
    paddingVertical: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    borderWidth: 3,
    borderColor: CORES.borda,
    borderBottomWidth: 8, // O botão grosso de jogo
  },
  botaoPressionado: {
    transform: [{ translateY: 5 }],
    borderBottomWidth: 3, // Afunda o botão ao ser clicado
  },
  textoBotao: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '900', 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});