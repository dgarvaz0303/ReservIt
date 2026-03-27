
Configuración del backend

Crear entorno virtual:
  python -m venv venv
  
Activar entorno:
  venv\Scripts\activate

Instalar dependencias:
  pip install -r requirements.txt

Variables de entorno
  Crear un archivo .env dentro de backend/ con:
    SUPABASE_URL=https://hncbzycaenboslmsgutc.supabase.co
    SUPABASE_KEY=sb_publishable_vNfprgb3olyDmRJKdwYUEw_jjJ1bLB6

Ejecutar el servidor
  uvicorn app.main:app --reload
