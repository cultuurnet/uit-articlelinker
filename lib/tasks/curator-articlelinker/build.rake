namespace 'curator-articlelinker' do
  desc "Build binaries"
  task :build do |task|
    system('npm install --production') or exit 1
  end
end
