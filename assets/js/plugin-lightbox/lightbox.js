{{- with .Scratch.Get "plugin-lightbox.Parameters" -}}

  {{- $settings := dict -}}
    
    {{- range $key, $value := .GLightbox -}}
      {{- $key = printf "%s%s" (substr $key 0 1 | lower) (substr $key 1) -}}
      {{- with $value -}}
        {{- $settings = merge $settings (dict $key .) -}}
      {{- end -}}
    {{- end -}}

const lightbox = GLightbox({{ $settings | jsonify | safeJS }});

{{- if .Config.GenerateEvents }}

lightbox.on('open', () => {
  if (typeof dataLayer === 'undefined') { return; }
  dataLayer.push({'event': 'lightbox_opened'});
});

lightbox.on('close', () => {
  if (typeof dataLayer === 'undefined') { return; }
  dataLayer.push({'event': 'lightbox_closed'});
});

lightbox.on('slide_changed', ({ prev, current }) => {
  
  if (typeof dataLayer === 'undefined') { return; }
  
  // Prev and current are objects that contain the following data
  // const { slideIndex, slideNode, slideConfig, player, trigger } = current;
  let event = 'lightbox_slide_changed';
  let title = current.slideConfig.title;
  let alt = current.slideConfig.alt;
  let description = current.slideConfig.description;
  let type = current.slideConfig.type;
  
  dataLayer.push({'event': event,
                  'slide_title': title,
                  'art_piece':title,
                  'slide_alt': alt,
                  'slide_description': description,
                  'slide_type': type});
  
});

{{- end -}}

{{- end }}