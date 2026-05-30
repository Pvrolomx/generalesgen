'use client'
import { useState } from 'react'
import { LANGS, t } from './i18n'

const C = {
  bg:'#080F1A',bgCard:'#0E1B2E',bgInput:'#111E30',
  border:'rgba(201,168,76,0.2)',borderFocus:'rgba(201,168,76,0.6)',
  gold:'#C9A84C',goldBright:'#E8C96A',cream:'#F5F0E8',
  muted:'rgba(245,240,232,0.45)',dim:'rgba(245,240,232,0.25)',section:'#1B3A5C',
}

function feetInchesToMeters(ft,inches){const t=(parseFloat(ft)||0)*12+(parseFloat(inches)||0);return t>0?(t*0.0254).toFixed(2):''}
function lbsToKg(lbs){const v=parseFloat(lbs);return v>0?(v*0.453592).toFixed(1):''}

const DEMO_DATA={
  firstName:'Rolando',lastName:'Romero García',dob:'27/04/1966',pob:'Puerto Vallarta, Jalisco',
  nationality:'Mexicana',maritalStatus:'Married',maritalRegime:'SepProp',sexo:'M',
  idType:'INE',idNumber:'1974076048195',idIssued:'2018',idExpiry:'2028',idIssuingAuth:'Mexican Government',
  curp:'ROGR660427HJCMRL00',rfc:'ROGR660427SK8',
  email:'pvrolomx@yahoo.com.mx',cellPhone:'322 111 0294',
  addressMX:'Brasil 1434, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
  occupation:'Employed',occupationDetail:'Abogado',positionInCompany:'Auto Empleado',
  companyName:'Expat Advisor MX',companyType:'Consultoría Inmobiliaria',companyPhone:'322 111 0294',
  companyAddress:'Brasil 1434, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',
  showRef1:true,ref1Name:'Claudia Rebeca Castillo Soto',ref1Address:'Paseo del Arque 59, Las Ceibas, Bahía de Banderas, Nayarit, 63735',ref1Phone:'322 306 8482',ref1Email:'claudia@castlesolutions.biz',
  showRef2:true,ref2Name:'Sergio Arturo Miramontes Macías',ref2Address:'Bolivia 1008, 5 de Diciembre, Puerto Vallarta, Jalisco, 48350',ref2Phone:'322 150 6996',ref2Email:'smiramontesm@yahoo.com',
}

const S={
  page:{minHeight:'100vh',display:'flex',flexDirection:'column',background:C.bg},
  header:{background:'rgba(8,15,26,0.98)',borderBottom:`1px solid ${C.border}`,padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100},
  main:{flex:1,padding:'32px 20px',maxWidth:760,width:'100%',margin:'0 auto'},
  card:{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:8,padding:'20px 24px',marginBottom:16},
  secHdr:{background:C.section,borderRadius:6,padding:'10px 16px',marginBottom:16,marginTop:8,fontSize:11,fontWeight:'bold',letterSpacing:'0.12em',color:C.goldBright},
  label:{display:'block',fontSize:11,fontWeight:'bold',color:C.muted,letterSpacing:'0.06em',marginBottom:5,textTransform:'uppercase'},
  input:{width:'100%',background:C.bgInput,border:'1px solid rgba(201,168,76,0.15)',borderRadius:4,padding:'9px 12px',fontSize:13,color:C.cream,outline:'none',boxSizing:'border-box',fontFamily:'Arial,sans-serif'},
  textarea:{width:'100%',background:C.bgInput,border:'1px solid rgba(201,168,76,0.15)',borderRadius:4,padding:'9px 12px',fontSize:13,color:C.cream,outline:'none',boxSizing:'border-box',fontFamily:'Arial,sans-serif',resize:'vertical',minHeight:64},
  select:{width:'100%',background:C.bgInput,border:'1px solid rgba(201,168,76,0.15)',borderRadius:4,padding:'9px 12px',fontSize:13,color:C.cream,outline:'none',boxSizing:'border-box',fontFamily:'Arial,sans-serif',appearance:'none',cursor:'pointer'},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14},
  btnPrimary:{padding:'11px 28px',background:'linear-gradient(135deg,rgba(201,168,76,0.3),rgba(201,168,76,0.15))',border:'1px solid rgba(201,168,76,0.6)',borderRadius:5,color:C.gold,fontSize:13,fontWeight:'bold',letterSpacing:'0.06em',cursor:'pointer',fontFamily:'Arial,sans-serif'},
  btnSec:{padding:'10px 20px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.muted,fontSize:12,cursor:'pointer',fontFamily:'Arial,sans-serif'},
  footer:{borderTop:`1px solid ${C.border}`,padding:'14px 24px',textAlign:'center',fontSize:11,color:C.dim,background:'rgba(8,15,26,0.9)'},
}

function Field({label,fkey,value,onChange,type='text',placeholder='',options,required}){
  const onFocus=e=>{e.target.style.borderColor=C.borderFocus}
  const onBlur=e=>{e.target.style.borderColor='rgba(201,168,76,0.15)'}
  const lbl=<label style={S.label}>{label}{required&&<span style={{color:C.gold}}> *</span>}</label>
  if(type==='select') return(
    <div>{lbl}<div style={{position:'relative'}}>
      <select style={S.select} value={value||''} onChange={e=>onChange(fkey,e.target.value)}>
        {options.map(o=><option key={o.v} value={o.v}>{o.l||'—'}</option>)}
      </select>
      <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:C.gold,pointerEvents:'none',fontSize:10}}>▼</span>
    </div></div>
  )
  if(type==='textarea') return(
    <div>{lbl}<textarea style={S.textarea} placeholder={placeholder} value={value||''} rows={3}
      onChange={e=>onChange(fkey,e.target.value)} onFocus={onFocus} onBlur={onBlur}/></div>
  )
  return(
    <div>{lbl}<input style={S.input} type={type==='date-text'?'text':type} placeholder={placeholder}
      value={value||''} onChange={e=>onChange(fkey,e.target.value)} onFocus={onFocus} onBlur={onBlur}/></div>
  )
}
function Row2({children}){return <div style={{...S.grid2,marginBottom:14}}>{children}</div>}
function Row1({children}){return <div style={{marginBottom:14}}>{children}</div>}
function SecHdr({label,bg}){return <div style={{...S.secHdr,marginBottom:16,marginTop:8,...(bg?{background:bg}:{})}}>{label}</div>}
function SubLabel({children}){return <div style={{fontSize:10,color:C.dim,letterSpacing:'0.1em',textTransform:'uppercase',margin:'12px 0 10px'}}>{children}</div>}
function ToggleSecHdr({label,show,onToggle,color}){
  const col=color||C.gold
  return(
    <div style={{display:'flex',alignItems:'center',gap:12,margin:'8px 0 0'}}>
      <div style={{...S.secHdr,margin:0,flex:1,...(color?{background:'#2C1B4E'}:{})}}>{label}</div>
      <button onClick={onToggle} style={{padding:'5px 14px',fontSize:11,fontWeight:'bold',cursor:'pointer',borderRadius:4,
        border:`1px solid ${show?col.replace(')',',0.6)').replace('rgb','rgba'):'rgba(201,168,76,0.25)'}`,
        background:show?'rgba(180,120,255,0.12)':'transparent',
        color:show?(color||C.gold):C.muted,fontFamily:'Arial,sans-serif',whiteSpace:'nowrap',transition:'all 0.15s'}}>
        {show?'▲':'▼'}
      </button>
    </div>
  )
}

// ─── SELECT OPTION HELPERS ─────────────────────────────────────────
function opt(v,l){return{v,l}}
function optBlank(){return opt('','')}

export default function GeneralesGen(){
  const [data,setData]=useState({})
  const [lang,setLang]=useState('es')
  const [generating,setGenerating]=useState(false)
  const [error,setError]=useState('')
  const [saved,setSaved]=useState(false)

  const set=(k,v)=>{setData(p=>({...p,[k]:v}));setSaved(false)}
  const f=key=>data[key]||''
  const T=k=>t(k,lang)

  // Derived flags
  const nat=data.nationality||''
  const isMexican=nat==='Mexicana'
  const isUS=nat==='American'
  const isCanadian=nat==='Canadian'
  const isForeign=!!nat&&!isMexican
  const isMarried=data.maritalStatus==='Married'||data.maritalStatus==='CommonLaw'
  const isEmployed=data.occupation==='Employed'
  const isRetired=data.occupation==='Retired'||data.occupation==='Unemployed'
  const legalStatus=data.legalStatus||''
  const isResident=legalStatus==='RT'||legalStatus==='RP'
  const showRef1=!!data.showRef1
  const showRef2=!!data.showRef2
  const showAddressAbroad=!!data.showAddressAbroad
  const showMigra=!!data.showMigra
  const isWorking=(data.actividadPrincipal||'').includes('Working')||(data.actividadPrincipal||'')==='Trabajar'

  const filled=Object.keys(data).filter(k=>!k.startsWith('_')&&data[k]&&String(data[k]).trim()).length

  const handleGenerate=async()=>{
    if(!f('firstName')&&!f('lastName')){setError(T('errorRequired'));return}
    setError('');setGenerating(true)
    try{
      const payload={...data,lang,fullName:[f('firstName'),f('lastName')].filter(Boolean).join(' '),homePhone:f('homePhone')||f('cellPhone')}
      const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      if(!res.ok)throw new Error()
      const blob=await res.blob()
      const url=URL.createObjectURL(blob)
      const a=document.createElement('a')
      a.href=url;a.download=`GENERALES_${(f('lastName')||'CLIENTE').replace(/[^A-Z0-9]/gi,'_').toUpperCase().slice(0,20)}.docx`;a.click()
      URL.revokeObjectURL(url)
    }catch{setError(T('errorGenerate'))}
    setGenerating(false)
  }
  const handleSave=()=>{
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a')
    a.href=url;a.download=`generales_${(f('lastName')||'cliente').toLowerCase()}.json`;a.click()
    URL.revokeObjectURL(url);setSaved(true)
  }
  const handleLoad=()=>{
    const input=document.createElement('input');input.type='file';input.accept='.json'
    input.onchange=e=>{
      const file=e.target.files[0];if(!file)return
      const reader=new FileReader()
      reader.onload=ev=>{try{setData(JSON.parse(ev.target.result));setSaved(true)}catch{setError(T('errorJSON'))}}
      reader.readAsText(file)
    }
    input.click()
  }

  return(
    <div style={S.page}>

      {/* HEADER */}
      <header style={S.header}>
        <div>
          <div style={{fontSize:20,fontWeight:'bold',letterSpacing:'0.05em',background:`linear-gradient(90deg,${C.gold},${C.goldBright},${C.gold})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>GeneralesGen</div>
          <div style={{fontSize:10,color:C.dim,letterSpacing:'0.1em',textTransform:'uppercase'}}>Expat Advisor MX — {T('appSubtitle')}</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {/* LANGUAGE TOGGLE */}
          <div style={{display:'flex',gap:2,border:`1px solid ${C.border}`,borderRadius:5,overflow:'hidden'}}>
            {LANGS.map(l=>(
              <button key={l.code} onClick={()=>setLang(l.code)} style={{
                padding:'6px 10px',fontSize:11,fontWeight:'bold',cursor:'pointer',border:'none',fontFamily:'Arial,sans-serif',
                background:lang===l.code?'rgba(201,168,76,0.2)':'transparent',
                color:lang===l.code?C.gold:C.muted,transition:'all 0.15s',
              }}>{l.flag} {l.label}</button>
            ))}
          </div>
          <button style={S.btnSec} onClick={handleLoad}>{T('btnLoad')}</button>
          <button style={S.btnSec} onClick={handleSave}>{saved?T('btnSaved'):T('btnSave')}</button>
          <button style={{...S.btnSec,color:'rgba(231,76,60,0.6)',borderColor:'rgba(231,76,60,0.3)'}} onClick={()=>{if(confirm(T('clearConfirm'))){setData({});setSaved(false);setError('')}}}>{T('btnClear')}</button>
          <button style={{...S.btnSec,color:C.gold,borderColor:'rgba(201,168,76,0.5)',background:'rgba(201,168,76,0.08)'}} onClick={()=>{setData(DEMO_DATA);setSaved(false);setError('')}}>{T('btnDemo')}</button>
        </div>
      </header>

      {/* PROGRESS */}
      <div style={{background:'rgba(14,27,46,0.8)',borderBottom:`1px solid ${C.border}`,padding:'12px 24px'}}>
        <div style={{maxWidth:760,margin:'0 auto',display:'flex',alignItems:'center',gap:14}}>
          <div style={{flex:1,height:4,background:'rgba(201,168,76,0.1)',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${Math.min(100,Math.round(filled/20*100))}%`,background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,borderRadius:2,transition:'width 0.3s'}}/>
          </div>
          <div style={{fontSize:11,color:C.muted,whiteSpace:'nowrap'}}>{filled} {T('progressLabel')}</div>
        </div>
      </div>

      {/* FORM */}
      <main style={S.main}>
        <div style={{marginBottom:24}}>
          <h2 style={{fontSize:20,color:C.gold,margin:'0 0 6px',fontFamily:'Georgia,serif'}}>{T('appSubtitle')}</h2>
          <p style={{fontSize:12,color:C.muted,margin:0}}>{T('formSubtitle')}</p>
        </div>

        <div style={S.card}>

          {/* ── 1. PERSONAL */}
          <SecHdr label={T('sec1')}/>
          <Row2>
            <Field fkey="firstName" label={T('firstName')} placeholder={T('phFirstName')} value={f('firstName')} onChange={set} required/>
            <Field fkey="lastName"  label={T('lastName')}  placeholder={T('phLastName')}  value={f('lastName')}  onChange={set} required/>
          </Row2>
          <Row2>
            <Field fkey="dob" label={T('dob')} placeholder={T('phDob')} value={f('dob')} onChange={set} type="date-text"/>
            <Field fkey="pob" label={T('pob')} placeholder={T('phPob')} value={f('pob')} onChange={set}/>
          </Row2>
          <Row2>
            <Field fkey="nationality" label={T('nationality')} type="select"
              options={[optBlank(),opt('Mexicana',T('optNatMex')),opt('American',T('optNatUS')),opt('Canadian',T('optNatCA')),opt('Other',T('optNatOther'))]}
              value={f('nationality')} onChange={set}/>
            <Field fkey="maritalStatus" label={T('maritalStatus')} type="select"
              options={[optBlank(),opt('Single',T('optSingle')),opt('Married',T('optMarried')),opt('Divorced',T('optDivorced')),opt('Widowed',T('optWidowed')),opt('CommonLaw',T('optCommonLaw'))]}
              value={f('maritalStatus')} onChange={set}/>
          </Row2>
          {isMarried&&(
            <Row1>
              <Field fkey="maritalRegime" label={T('maritalRegime')} type="select"
                options={[optBlank(),opt('SepProp',T('optSepProp')),opt('CommProp',T('optCommProp'))]}
                value={f('maritalRegime')} onChange={set}/>
            </Row1>
          )}
          <Row1>
            <Field fkey="sexo" label={T('sexo')} type="select"
              options={[optBlank(),opt('M',T('optMale')),opt('F',T('optFemale'))]}
              value={f('sexo')} onChange={set}/>
          </Row1>

          {/* ── 2. ID */}
          <SecHdr label={T('sec2')}/>
          <Row2>
            <Field fkey="idType" label={T('idType')} type="select"
              options={isMexican
                ?[optBlank(),opt('INE',T('optIDIne')),opt('Passport',T('optIDPassport')),opt('License',T('optIDLicense'))]
                :[opt('Passport',T('optIDPassport')),opt('INE',T('optIDIne')),opt('Resident',T('optIDResident')),opt('License',T('optIDLicense'))]}
              value={f('idType')||(isMexican?'':'Passport')} onChange={set}/>
            <Field fkey="idNumber" label={T('idNumber')} placeholder={T('phIdNumber')} value={f('idNumber')} onChange={set}/>
          </Row2>
          <Row2>
            <Field fkey="idIssued" label={T('idIssued')} placeholder="YYYY" value={f('idIssued')} onChange={set}/>
            <Field fkey="idExpiry" label={T('idExpiry')} placeholder="YYYY" value={f('idExpiry')} onChange={set}/>
          </Row2>
          <Row1>
            <Field fkey="idIssuingAuth" label={T('idIssuingAuth')} placeholder={T('phIdAuth')} value={f('idIssuingAuth')} onChange={set}/>
          </Row1>
          {isForeign&&(
            <Row2>
              <Field fkey="legalStatus" label={T('legalStatus')} type="select"
                options={[optBlank(),opt('Tourist',T('optTourist')),opt('RT',T('optRT')),opt('RP',T('optRP'))]}
                value={f('legalStatus')} onChange={set}/>
              {isResident&&(
                <Field fkey="migraDocNumber" label={T('migraDocNumber')} placeholder={T('phMigraDoc')} value={f('migraDocNumber')} onChange={set}/>
              )}
            </Row2>
          )}

          {/* ── 3. TAX */}
          <SecHdr label={T('sec3')}/>
          {isMexican?(
            <Row2>
              <Field fkey="curp" label="CURP" placeholder="ROGR660427HJCMRL00" value={f('curp')} onChange={set}/>
              <Field fkey="rfc"  label="RFC"  placeholder="ROGR660427SK8"       value={f('rfc')}  onChange={set}/>
            </Row2>
          ):isResident?(
            <>
              <Row2>
                <Field fkey="curp" label={T('curpINM')} placeholder="XXXX000000XXXXXX00" value={f('curp')} onChange={set}/>
                <Field fkey="rfc"  label={T('rfcOptional')} placeholder="XXXX000000XXX" value={f('rfc')} onChange={set}/>
              </Row2>
              {isUS&&<Row1><Field fkey="ssn" label={T('ssnUS')} placeholder="XXX-XX-XXXX" value={f('ssn')} onChange={set}/></Row1>}
              {isCanadian&&<Row1><Field fkey="ssn" label={T('sinCA')} placeholder="NNN NNN NNN" value={f('ssn')} onChange={set}/></Row1>}
              {!isUS&&!isCanadian&&<Row1><Field fkey="ssn" label={T('taxOtherOpt')} placeholder="" value={f('ssn')} onChange={set}/></Row1>}
            </>
          ):isForeign?(
            <>
              {isUS&&<Row1><Field fkey="ssn" label={T('ssnUS')} placeholder="XXX-XX-XXXX" value={f('ssn')} onChange={set}/></Row1>}
              {isCanadian&&<Row1><Field fkey="ssn" label={T('sinCA')} placeholder="NNN NNN NNN" value={f('ssn')} onChange={set}/></Row1>}
              {!isUS&&!isCanadian&&(
                <div style={{padding:'8px 12px',background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:4,fontSize:11,color:'rgba(201,168,76,0.7)',marginBottom:8}}>
                  {T('taxHint')}
                </div>
              )}
            </>
          ):null}

          {/* ── 4. CONTACT */}
          <SecHdr label={T('sec4')}/>
          <Row1><Field fkey="email" label={T('email')} placeholder="cliente@ejemplo.com" value={f('email')} onChange={set} type="email"/></Row1>
          <Row2>
            <Field fkey="cellPhone" label={T('cellPhone')} placeholder="+52 322 000 0000" value={f('cellPhone')} onChange={set} type="tel"/>
            <Field fkey="homePhone" label={T('homePhone')} placeholder="+1 555 000 0000" value={f('homePhone')} onChange={set} type="tel"/>
          </Row2>

          {/* ── 5. ADDRESS */}
          <SecHdr label={T('sec5')}/>
          <Row1><Field fkey="addressMX" label={T('addressMX')} placeholder={T('phAddressMX')} value={f('addressMX')} onChange={set} type="textarea"/></Row1>
          {!isForeign&&(
            <button type="button"
              style={{...S.btnSec,marginTop:8,color:C.gold,borderColor:'rgba(201,168,76,0.4)'}}
              onClick={()=>set('showAddressAbroad',!showAddressAbroad)}>
              {showAddressAbroad?'− ':'+ '}{lang==='en'?'Add address abroad':lang==='fr'?'Ajouter une adresse à l\u2019étranger':'Agregar domicilio en el extranjero'}
            </button>
          )}
          {(isForeign||showAddressAbroad)&&<Row1><Field fkey="addressAbroad" label={T('addressAbroad')} placeholder={T('phAddressAbroad')} value={f('addressAbroad')} onChange={set} type="textarea"/></Row1>}

          {/* ── 6. OCCUPATION */}
          <SecHdr label={T('sec6')}/>
          <Row2>
            <Field fkey="occupation" label={T('employmentStatus')} type="select"
              options={[optBlank(),opt('Employed',T('optEmployed')),opt('Retired',T('optRetired')),opt('Unemployed',T('optUnemployed'))]}
              value={f('occupation')} onChange={set}/>
            {isEmployed&&<Field fkey="occupationDetail" label={T('occupationDetail')} placeholder={T('phOccupation')} value={f('occupationDetail')} onChange={set}/>}
          </Row2>
          {isEmployed&&(
            <>
              <Row2>
                <Field fkey="positionInCompany" label={T('position')}    placeholder={T('phPosition')}    value={f('positionInCompany')} onChange={set}/>
                <Field fkey="companyName"        label={T('companyName')} placeholder={T('phCompanyName')} value={f('companyName')} onChange={set}/>
              </Row2>
              <Row2>
                <Field fkey="companyType"  label={T('companyType')}  placeholder={T('phCompanyType')} value={f('companyType')} onChange={set}/>
                <Field fkey="companyPhone" label={T('companyPhone')} placeholder="+52 322 000 0000"   value={f('companyPhone')} onChange={set} type="tel"/>
              </Row2>
              <Row1><Field fkey="companyAddress" label={T('companyAddress')} placeholder={T('phCompanyAddr')} value={f('companyAddress')} onChange={set} type="textarea"/></Row1>
            </>
          )}

          {/* ── 7. REF 1 */}
          <ToggleSecHdr label={T('sec7')} show={showRef1} onToggle={()=>set('showRef1',!showRef1)}/>
          <div style={{marginBottom:16}}/>
          {showRef1&&(
            <>
              <Row2>
                <Field fkey="ref1Name"  label={T('refName')}  placeholder={T('phRefName')}    value={f('ref1Name')}  onChange={set}/>
                <Field fkey="ref1Phone" label={T('refPhone')} placeholder="+52 322 000 0000"  value={f('ref1Phone')} onChange={set} type="tel"/>
              </Row2>
              <Row2>
                <Field fkey="ref1Email"   label={T('email')}      placeholder="email@ejemplo.com" value={f('ref1Email')}   onChange={set} type="email"/>
                <Field fkey="ref1Address" label={T('refAddress')} placeholder={T('phRefAddress')} value={f('ref1Address')} onChange={set}/>
              </Row2>
            </>
          )}

          {/* ── 8. REF 2 */}
          <ToggleSecHdr label={T('sec8')} show={showRef2} onToggle={()=>set('showRef2',!showRef2)}/>
          <div style={{marginBottom:16}}/>
          {showRef2&&(
            <>
              <Row2>
                <Field fkey="ref2Name"  label={T('refName')}  placeholder={T('phRefName')}    value={f('ref2Name')}  onChange={set}/>
                <Field fkey="ref2Phone" label={T('refPhone')} placeholder="+52 322 000 0000"  value={f('ref2Phone')} onChange={set} type="tel"/>
              </Row2>
              <Row2>
                <Field fkey="ref2Email"   label={T('email')}      placeholder="email@ejemplo.com" value={f('ref2Email')}   onChange={set} type="email"/>
                <Field fkey="ref2Address" label={T('refAddress')} placeholder={T('phRefAddress')} value={f('ref2Address')} onChange={set}/>
              </Row2>
            </>
          )}

          {/* ── 9. FORMATO BÁSICO — solo extranjeros */}
          {isForeign&&(
            <>
              <ToggleSecHdr label={T('sec9')} show={showMigra} onToggle={()=>set('showMigra',!showMigra)} color="#C084FC"/>
              <div style={{marginBottom:16}}/>
            </>
          )}
          {isForeign&&showMigra&&(
            <>
              <SubLabel>{T('subPersonal')}</SubLabel>
              <Row2>
                <Field fkey="numHijos" label={T('numHijos')} placeholder="0" value={f('numHijos')} onChange={set}/>
                <Field fkey="idiomaMaterno" label={T('idiomaMaterno')} placeholder={T('phIdioma')} value={f('idiomaMaterno')} onChange={set}/>
              </Row2>
              <Row2>
                <Field fkey="hablaEspanol" label={T('hablaEspanol')} type="select"
                  options={[optBlank(),opt('Si',T('optSiYes')),opt('No',T('optNoNo')),opt('Basico',T('optBasico'))]}
                  value={f('hablaEspanol')} onChange={set}/>
                <Field fkey="religion" label={T('religion')} placeholder={T('phReligion')} value={f('religion')} onChange={set}/>
              </Row2>
              <Row2>
                <Field fkey="raza" label={T('raza')} type="select"
                  options={[optBlank(),opt('Blanca',T('optBlanca')),opt('Amarilla',T('optAmarilla')),opt('Negra',T('optNegra')),opt('Nativa',T('optNativa')),opt('Mestiza',T('optMestiza'))]}
                  value={f('raza')} onChange={set}/>
                <Field fkey="escolaridad" label={T('escolaridad')} type="select"
                  options={[optBlank(),opt('None',T('optEduNone')),opt('Prim',T('optEduPrim')),opt('Sec',T('optEduSec')),opt('Prep',T('optEduPrep')),opt('Lic',T('optEduLic')),opt('Mae',T('optEduMae')),opt('Doc',T('optEduDoc')),opt('Pos',T('optEduPos'))]}
                  value={f('escolaridad')} onChange={set}/>
              </Row2>
              <Row2>
                <Field fkey="areaConocimiento" label={T('areaConocimiento')} placeholder={T('phArea')} value={f('areaConocimiento')} onChange={set}/>
              </Row2>

              <SubLabel>{T('subFiliacion')}</SubLabel>

              {/* ESTATURA */}
              <div style={{marginBottom:14}}>
                <label style={S.label}>{T('labelEstatura')}</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,alignItems:'end'}}>
                  <div>
                    <label style={{...S.label,fontSize:10,color:C.dim}}>{T('labelFeet')}</label>
                    <input style={S.input} type="number" min="3" max="8" placeholder="5"
                      value={data.heightFt||''}
                      onChange={e=>{const ft=e.target.value;set('heightFt',ft);const m=feetInchesToMeters(ft,data.heightIn||0);if(m)set('estatura',m)}}/>
                  </div>
                  <div>
                    <label style={{...S.label,fontSize:10,color:C.dim}}>{T('labelInches')}</label>
                    <input style={S.input} type="number" min="0" max="11" placeholder="10"
                      value={data.heightIn||''}
                      onChange={e=>{const inches=e.target.value;set('heightIn',inches);const m=feetInchesToMeters(data.heightFt||0,inches);if(m)set('estatura',m)}}/>
                  </div>
                  <div>
                    <label style={{...S.label,fontSize:10,color:C.goldBright}}>{T('labelMetros')}</label>
                    <input style={{...S.input,borderColor:'rgba(201,168,76,0.4)',color:C.gold}} type="text" placeholder="1.78"
                      value={f('estatura')} onChange={e=>set('estatura',e.target.value)}/>
                  </div>
                  <Field fkey="complexion" label={T('complexion')} type="select"
                    options={[optBlank(),opt('Delgada',T('optDelgada')),opt('Mediana',T('optMediana')),opt('Robusta',T('optRobusta'))]}
                    value={f('complexion')} onChange={set}/>
                </div>
              </div>

              {/* PESO */}
              <div style={{marginBottom:14}}>
                <label style={S.label}>{T('labelPeso')}</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,alignItems:'end'}}>
                  <div>
                    <label style={{...S.label,fontSize:10,color:C.dim}}>{T('labelLbs')}</label>
                    <input style={S.input} type="number" min="50" max="600" placeholder="175"
                      value={data.weightLbs||''}
                      onChange={e=>{const lbs=e.target.value;set('weightLbs',lbs);const kg=lbsToKg(lbs);if(kg)set('peso',kg)}}/>
                  </div>
                  <div>
                    <label style={{...S.label,fontSize:10,color:C.goldBright}}>{T('labelKg')}</label>
                    <input style={{...S.input,borderColor:'rgba(201,168,76,0.4)',color:C.gold}} type="text" placeholder="79.4"
                      value={f('peso')} onChange={e=>set('peso',e.target.value)}/>
                  </div>
                  <div style={{gridColumn:'span 2'}}>
                    <Field fkey="senas" label={T('senas')} placeholder={T('phSenas')} value={f('senas')} onChange={set}/>
                  </div>
                </div>
              </div>

              <SubLabel>{T('subResidencia')}</SubLabel>
              <Row2>
                <Field fkey="paisResidenciaAnterior" label={T('paisAnterior')} placeholder={T('phPaisAnterior')} value={f('paisResidenciaAnterior')} onChange={set}/>
                <Field fkey="tipoPoblacion" label={T('tipoPoblacion')} type="select"
                  options={[optBlank(),opt('Ciudad',T('optCiudad')),opt('Suburbio',T('optSuburbio')),opt('Pueblo',T('optPueblo')),opt('Aldea',T('optAldea')),opt('Caserio',T('optCaserio'))]}
                  value={f('tipoPoblacion')} onChange={set}/>
              </Row2>
              <Row2>
                <Field fkey="nombrePoblacion" label={T('nombrePoblacion')} placeholder={T('phNombrePob')} value={f('nombrePoblacion')} onChange={set}/>
                <Field fkey="estadoProvincia"  label={T('estadoProvincia')} placeholder={T('phEstadoProv')} value={f('estadoProvincia')} onChange={set}/>
              </Row2>

              <SubLabel>{T('subLaboral')}</SubLabel>
              <Row2>
                <Field fkey="actividadPrincipal" label={T('actividadPrincipal')} type="select"
                  options={[optBlank(),opt('Working',T('optTrabajar')),opt('Studying',T('optEstudiar')),opt('Hogar',T('optHogar')),opt('Retired',T('optJubilado')),opt('Minister',T('optMinistro')),opt('Investor',T('optRentista')),opt('Unemployed',T('optDesempleado'))]}
                  value={f('actividadPrincipal')} onChange={set}/>
                <Field fkey="ingresoMensualUSD" label={T('ingresoUSD')} placeholder={T('phIngreso')} value={f('ingresoMensualUSD')} onChange={set}/>
              </Row2>
              {isWorking&&(
                <>
                  <Row2>
                    <Field fkey="sectorTrabajo" label={T('sectorTrabajo')} type="select"
                      options={[optBlank(),opt('Agro','Agropecuario / Agriculture'),opt('Mining','Minería / Mining'),opt('Constr','Construcción / Construction'),opt('Manuf','Manufactura / Manufacturing'),opt('Commerce','Comercio / Commerce'),opt('Transport','Transportes / Transportation'),opt('Edu','Servicios educativos / Education'),opt('Health','Salud / Health'),opt('Tech','Tecnología / Technology'),opt('Gov','Gobierno / Government'),opt('Other','Otro / Other')]}
                      value={f('sectorTrabajo')} onChange={set}/>
                    <Field fkey="situacionTrabajo" label={T('situacionTrabajo')} type="select"
                      options={[optBlank(),opt('Employee','Empleado / Employee'),opt('Patron','Patrón / Employer'),opt('Independent','Independiente / Self-employed'),opt('DayLabor','Jornalero / Day laborer'),opt('Other','Otro / Other')]}
                      value={f('situacionTrabajo')} onChange={set}/>
                  </Row2>
                  <Row1>
                    <Field fkey="ocupacionTrabajo" label={T('ocupacionTrabajo')} type="select"
                      options={[optBlank(),opt('Prof','Profesionista / Professional'),opt('Exec','Directivo / Executive'),opt('Admin','Administrativo / Administrative'),opt('Sales','Comerciante / Sales'),opt('Services','Servicios / Services'),opt('Agro','Agropecuario / Agricultural'),opt('Industrial','Industrial'),opt('Other','Otro / Other')]}
                      value={f('ocupacionTrabajo')} onChange={set}/>
                  </Row1>
                </>
              )}

              <SubLabel>{T('subMexico')}</SubLabel>
              <Row2>
                <Field fkey="anosExpMexico"       label={T('anosExp')}        placeholder="0"  value={f('anosExpMexico')}       onChange={set}/>
                <Field fkey="periodoContratacion"  label={T('periodoContrat')} placeholder="12" value={f('periodoContratacion')}  onChange={set}/>
              </Row2>
            </>
          )}

        </div>

        {error&&<div style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',borderRadius:6,padding:'10px 16px',marginBottom:16,fontSize:13,color:'#E74C3C'}}>⚠ {error}</div>}

        <div style={{display:'flex',gap:12,justifyContent:'flex-end',paddingTop:8}}>
          <button style={S.btnSec} onClick={handleSave}>{T('btnSaveJSON')}</button>
          <button style={{...S.btnPrimary,opacity:generating?0.6:1}} onClick={handleGenerate} disabled={generating}>
            {generating?T('btnGenerating'):T('btnGenerate')}
          </button>
        </div>

        <div style={{marginTop:24,padding:'12px 16px',background:'rgba(27,58,92,0.3)',borderLeft:`3px solid ${C.gold}`,borderRadius:4,fontSize:11,color:C.dim,lineHeight:1.6}}>
          <strong style={{color:C.muted}}>i18n:</strong> {T('footerNote')}
        </div>
      </main>

      <footer style={S.footer}>GeneralesGen v1.3  |  Expat Advisor MX  |  La Colmena 2026</footer>
    </div>
  )
}
