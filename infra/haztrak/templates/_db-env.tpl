{{/*
Environment variables used to access the database
*/}}
{{- define "haztrak.db-env" }}
HT_DB_HOST: {{ .Values.global.db.host }}
HT_DB_PORT: {{ .Values.global.db.port | quote}}
HT_DB_NAME: {{ .Values.global.db.name }}
HT_DB_USER: {{ .Values.global.db.user }}
HT_DB_PASSWORD: {{ .Values.global.db.password }}
HT_DB_ENGINE: {{ .Values.global.db.engine }}
{{- end }}
