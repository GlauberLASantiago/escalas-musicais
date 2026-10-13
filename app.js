const $=id=>document.getElementById(id);
let player=null,level=0,muted=false,serial=0;
function dispose(){serial++;player?.remove();player=null;$('player-container').replaceChildren();}
function home(){dispose();level=0;$('game').hidden=true;$('welcome').hidden=false;$('status').textContent='';document.title='Escalas Musicais';window.scrollTo(0,0);}
async function start(value){
 const selected=Number(value);if(![1,2,3].includes(selected))return home();
 dispose();level=selected;const request=serial;
 $('welcome').hidden=true;$('game').hidden=false;$('level-title').textContent=`Nível ${level}`;document.title=`Nível ${level} · Escalas Musicais`;
 window.scrollTo(0,0);
 $('loading').hidden=false;$('status').textContent='';
 try{
  const ruffle=window.RufflePlayer?.newest();if(!ruffle)throw new Error('Player indisponível');
  player=ruffle.createPlayer();player.setAttribute('aria-label',`Jogo Escalas Musicais, nível ${level}`);$('player-container').append(player);
  const activePlayer=player;
  await player.ruffle().load({url:`assets/web/dificuldade_${level}.swf`,autoplay:'on',splashScreen:false,allowScriptAccess:false,allowNetworking:'internal',openUrlMode:'deny',scale:'showAll',forceScale:true,letterbox:'on',logLevel:'warn'});
  if(request!==serial||activePlayer!==player)return;
  player.ruffle().volume=muted?0:1;$('loading').hidden=true;
 }catch(error){if(request!==serial)return;$('loading').hidden=true;$('status').textContent='Não foi possível abrir o jogo. Verifique a conexão e use Reiniciar nível para tentar novamente.';console.error(error);}
}
function route(){const match=/^#nivel-([123])$/.exec(location.hash);if(match)start(match[1]);else home();}
document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>{const target=`#nivel-${button.dataset.level}`;if(location.hash===target)start(button.dataset.level);else location.hash=target;}));
$('home').addEventListener('click',()=>{location.hash='inicio';});
$('restart').addEventListener('click',()=>start(level));
$('mute').addEventListener('click',()=>{muted=!muted;if(player)player.ruffle().volume=muted?0:1;$('mute').textContent=muted?'Ativar som':'Silenciar';$('mute').setAttribute('aria-pressed',String(muted));});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('stage').requestFullscreen();}catch{$('status').textContent='A tela cheia não está disponível neste navegador.';}});
$('exit-fullscreen').addEventListener('click',()=>document.exitFullscreen().catch(()=>{}));
function showDialog(id){player?.ruffle().suspend();$(id).showModal();}
$('help-open').addEventListener('click',()=>showDialog('help'));$('help-close').addEventListener('click',()=>$('help').close());
$('original-about').addEventListener('click',()=>showDialog('about'));$('about-close').addEventListener('click',()=>$('about').close());
for(const id of ['help','about'])$(id).addEventListener('close',()=>{if(player&&!document.hidden)player.ruffle().resume();});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia';});
document.addEventListener('visibilitychange',()=>{if(!player)return;try{if(document.hidden)player.ruffle().suspend();else player.ruffle().resume();}catch{}});
window.addEventListener('hashchange',route);route();
