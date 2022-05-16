import { StreamOcrComponent } from './../../pages/stream-ocr/stream-ocr.component';
import { StreamingFaceComponent } from '../../pages/streaming-face/streaming-face.component';
import { RegisterComponent } from 'src/app/pages/registro/register.component';
import { GerenciarPessoaComponent } from './../../pages/gerenciar-pessoa/gerenciar-pessoa.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/minha-conta/user-profile.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { Guard } from 'src/app/auth/guard';
import { LivroOcorrenciaComponent } from 'src/app/pages/livro-ocorrencia/livro-ocorrencia.component';
import { RegistroLocalizacaoComponent } from 'src/app/pages/registro-localizacao/registro-localizacao.component';

export const AdminLayoutRoutes: Routes= [    
    { path: 'registro',                 component: RegisterComponent, canActivate: [Guard] },
    { path: 'dashboard',                component: DashboardComponent, canActivate: [Guard]},
    { path: 'minha_conta',              component: UserProfileComponent, canActivate: [Guard]},
    { path: 'usuario',                  component: UsuariosComponent, canActivate: [Guard]},
    { path: 'gerenciar',                component: GerenciarPessoaComponent, canActivate: [Guard]},
    { path: 'streaming_face',           component: StreamingFaceComponent, canActivate: [Guard]},
    { path: 'stream_ocr',               component: StreamOcrComponent, canActivate: [Guard]},
    { path: 'livro_ocorrencia',         component: LivroOcorrenciaComponent, canActivate: [Guard]},
    { path: 'registro_localizacao',     component: RegistroLocalizacaoComponent, canActivate: [Guard]}
]
