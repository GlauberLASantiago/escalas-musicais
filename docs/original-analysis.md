# Escalas Musicais — static shipped-artifact findings

Inspection performed without executing any native EXE. Evidence is local format-aware SWF parsing (`inspect_swf.py`, `abc_strings.py`, `static_text.py`), not native runtime observation or a complete decompilation. No FFDec or Java command was installed/discovered in PATH; a bounded FFDec-name search did not find an executable.

## Identity

`summary.json` retains SHA-256, sizes, Flash versions, dimensions, timing, and native carrier metadata. Every EXE embeds the corresponding supplied outer SWF **byte-exactly** at file offset 3,478,456. The three EXEs are thus projector carriers of the already available movies; preserving the SWF preserves the movie payload rather than attempting to reproduce its behavior from screenshots.

All outer movies are zlib-compressed CWS, SWF version 11, ActionScript 3 (FileAttributes bit 3; DoABC tag 82), 720 × 480. Levels 1/2 have 20 FPS and level 3 has 30 FPS. A SWF version is a file-format version; it does not establish a precise Adobe authoring application release.

Outer files use an Adobe-generated preloader and two embedded SWFs. Binary ID 2 is a loading animation; binary ID 3 is the game content. The preloader strings reference the historical Adobe Text Layout Framework 2.0.0.232 RSL at `fpdownload.adobe.com`; this is an observation of packaged strings, not a verified current dependency request. The content movies contain `fl.text`, `flashx.textLayout`, font and vector/text resources themselves.

Original wrappers are retained as `assets/original/dificuldade_1.swf` through `dificuldade_3.swf`. Unmodified embedded content movies are separately retained as `assets/original/nivel-1.swf` through `nivel-3.swf`; their digests appear in `level-N-static-text.json`. Loading content directly bypasses the wrapper/preloader. Compatibility and rendering still require browser runtime checks.

## Visible content and differences

Static text decoding resolves glyph indices against embedded DefineFont2/3 Unicode maps (Arial Black and Impact). Every level contains “INDIQUE A ESCALA DE:”, “Tente Novamente”, “PARABÉNS”, “ERROS”, and “ACERTOS”. The small credits/close controls are in TLF XML string pools.

Level 1 text labels cover G major/E minor, F major/D minor, C major/A minor; the minor forms are natural, harmonic and melodic.

Level 2 covers D major/B minor, B-flat major/G minor, A major/F-sharp minor, E-flat major/C minor, E major/C-sharp minor, A-flat major/F minor. An additional G major label occurs in the resource table; without a timeline/control-flow proof it is not counted as a distinct exercise.

Level 3 covers B major/G-sharp minor, D-flat major/B-flat minor, F-sharp major/D-sharp minor, G-flat major/E-flat minor, C-sharp major/A-sharp minor, C-flat major/A-flat minor. An additional G major label also occurs. Each minor pair again includes natural, harmonic and melodic labels.

All labels and resource IDs are retained in `level-N-static-text.json`; the content ActionScript constant string pools are in `level-N-embedded-3-abc-strings.json` and `.txt`.

Movie action strings reference `creditos.swf`, which is **absent from the supplied top-level directory inventory**. Level 1 references `dificuldade_2.swf`; level 2 references `dificuldade_3.swf`. The unified host can expose its own level navigation and credits handling, while retaining the original wrappers at those relative URLs for the embedded next-level loaders. These string observations do not establish which actions fired at runtime.

## Coverage limits

Graphical buttons can contain only vectors or glyph text, so absence of corresponding strings is not absence of functionality. Streaming audio tags are present (SoundStreamHead/SoundStreamBlock), but audio behavior is not established by this static inventory.

Source authoring path strings were retained only in local analysis, not inserted into the public-facing UI. Native EXE code was not disassembled because the byte-exact embedded SWF answers which game payload those projectors carry.

## Focused ABC body follow-up

`abc_methods.py` additionally parsed ABC constant pools, method tables, trait bindings, instance/class/script records and method bodies. `level-N-methods.json` retains the body bytes and resolved multiname tables for reproducibility. This remains a focused hand inspection of AVM2 opcodes rather than a complete high-level decompilation.

Level1 MainTimeline frame1 initializes `right_answers` and `wrong_answers` to 0. The method `change_question` increments the first if `certo.visible` is true and increments the second if `errado.visible` is true. The method `placar` assigns `ra.text = right_answers` and `wa.text = wrong_answers`. A correct handler such as `mm_harmonica` sets `errado.visible=false` and `certo.visible=true`, starts the correct animation at frame2, starts the main timeline at frame2, schedules `placar` after1ms via `setTimeout`, and invokes `change_question` immediately. A wrong handler such as `mm_melodicow` sets the inverse feedback flags, starts wrong animation and invokes the same score update. Counters are updated in movie logic even if a browser emulator fails to render their text.

The frame setup methods register/remove specific MouseEvent.CLICK handlers on the named scale buttons. Fixed authored frame positions determine the question sequence. Level1 has twelve question frame setup methods across three relative major/minor pairs; level2/3 have twenty-four across six pairs. `change_question` does not pick a random question despite its name; its observed body only updates score.

The content ABC creates a TLF paragraph field with Calibri13, embedFonts=true; a Calibri CFF/OTTO font is present in DefineFont4 tag91. The three DefineEditText records in level1 belong to PRÓXIMO control variants rather than the counters. Blank numeric score text observed by the parent in Ruffle therefore has a plausible CFF/TLF rendering cause, but this static inspection does not prove the exact unsupported runtime feature. Preserve this compatibility limit rather than treating empty rendering as absent counters in the original.

## Playback font variants (runtime verification required)

At the parent's request, `patch_tlf.py` builds separate `assets/web/nivel-N.swf` playback variants from embedded game content. Original carrier/wrapper/content assets are unchanged. Only ActionScript constant-pool strings containing `<tlfTextObject` XML are changed: `fontFamily="Calibri"` becomes `fontFamily="Arial"` and `embedFonts="true"` becomes `embedFonts="false"`. The requested `fontLookup="embeddedCFF"` literal was absent, so that replacement made no additional change. Three XML constants change in levels1/2 and four in level3; these include small close/credits controls as well as the empty paragraph template used by dynamic numeric text.

Constant indices, methods, bytecode instructions and non-XML strings remain unchanged. The tool reconstructs UTF-8 string lengths with U30 encoding, preserves the rest of each ABC byte-for-byte, reconstructs affected SWF tag lengths and uncompressed FileLength, then compresses the CWS movie. A decompression equality assertion verifies serialization. Source/web SHA-256, sizes and exact old/new strings are retained in `tlf-font-patch.json`. This is a targeted rendering compatibility modification; counters appearing and game behavior still require the parent's browser check.

Parent runtime testing found direct inner playback did not initialize frame scripts correctly (both feedback clips visible, counters blank). This rules out relying on bare inner content as the published entry point in the tested emulator context. Both inner and outer have AS3 FileAttributes0x18 and a SymbolClass binding for ID0: inner binds `dificuldade_N_fla.MainTimeline`, outer binds `MainTimeline__Preloader__`. Thus absence of a document class is not the explanation; the loader context/lifecycle remains important.

`patch_wrapper.py` therefore builds `assets/web/dificuldade_N.swf`, preserving every outer SWF payload except DefineBinaryData ID3, which now carries the font-patched inner content. Outer preloader ABC, SymbolClass, FileAttributes, loading-animation content and other tags remain unchanged. SymbolClass/FileAttributes equality against the original is asserted. `wrapper-patch.json` records old/new embedded and carrier hashes; these variants require separate browser testing. Original SWFs remain intact under `assets/original`.
