desc "Create a debian package from the binaries."
task :build_artifact do |task|

  calver_version = ENV['PIPELINE_VERSION'].nil? ? Time.now.strftime("%Y.%m.%d.%H%M%S") : ENV['PIPELINE_VERSION']
  git_short_ref  = `git rev-parse --short HEAD`.strip
  version        = ENV['ARTIFACT_VERSION'].nil? ? "#{calver_version}+sha.#{git_short_ref}" : ENV['ARTIFACT_VERSION']
  artifact_name  = 'uitdatabank-articlelinker'
  vendor         = 'publiq VZW'
  maintainer     = 'Infra publiq <infra@publiq.be>'
  license        = 'Apache-2.0'
  description    = 'UiTdatabank Article Linker'
  source         = 'https://github.com/cultuurnet/uit-articlelinker'
  build_url      = ENV['JOB_DISPLAY_URL'].nil? ? "" : ENV['JOB_DISPLAY_URL']

  FileUtils.mkdir_p('pkg')
  FileUtils.mkdir_p('log')

  system("fpm -s dir -t deb -n #{artifact_name} -v #{version} -a all -p pkg \
    -x pkg -x vendor -x lib -x Rakefile -x Gemfile -x Gemfile.lock \
    -x .bundle -x 'Jenkinsfile*' -x '.git*' -d nodejs \
    --prefix /var/www/uitdatabank-articlelinker \
    --config-files /var/www/uitdatabank-articlelinker/config.json \
    --config-files /var/www/uitdatabank-articlelinker/publishers.json \
    --deb-systemd lib/tasks/uitdatabank-articlelinker.service \
    --before-remove lib/tasks/prerm \
    --deb-user www-data --deb-group www-data \
    --description '#{description}' --url '#{source}' --vendor '#{vendor}' \
    --license '#{license}' -m '#{maintainer}' \
    --deb-field 'Pipeline-Version: #{calver_version}' \
    --deb-field 'Git-Ref: #{git_short_ref}' \
    --deb-field 'Build-Url: #{build_url}' \
    ."
  ) or exit 1
end
